<template>
  <div class="flex flex-col justify-center items-center">
    <div class="camera-wrapper" :class="{
      'border-blue-400': !readyToCapture && !imageCaptured,
      'border-green-500': readyToCapture || imageCaptured,
    }">
      <video ref="video" autoplay playsinline muted v-if="!imageCaptured && cameraActive" class="camera-video" />
      <img v-if="imageCaptured" :src="capturedImage" alt="Captured Face" class="camera-image" />
      <canvas ref="canvas" class="hidden"></canvas>

      <!-- Visual guides -->
      <div class="center-guide" v-if="!imageCaptured">
        <div class="crosshair"></div>
        <div class="distance-ring" :class="{ 'ring-green': readyToCapture }"></div>
        <!-- Axis lines -->
        <div class="axis-line x-axis"></div>
        <div class="axis-line y-axis"></div>
      </div>
    </div>

    <!-- Status indicators -->
    <div class="status-indicators mt-1 text-center">
      <div class="">
        <span class="font-medium">Position: </span>
        <span :class="{
          'text-red-500': !isFaceCentered && !imageCaptured,
          'text-yellow-500': isFaceCentered && faceDistanceScore < 70 && !imageCaptured,
          'text-green-500': readyToCapture || imageCaptured
        }">
          {{ facePositionStatus }}
        </span>
      </div>

      <div>
        <span class="font-medium">Distance: </span>
        <span :class="{
          'text-red-500': faceDistanceScore < 70 && !imageCaptured,
          'text-green-500': faceDistanceScore >= 70 || imageCaptured
        }">
          {{ faceDistanceScore.toFixed(0) }}%
          <span v-if="faceDistanceScore >= 70 || imageCaptured">✅</span>
          <span v-else>❌ (Need 70%+)</span>
        </span>
      </div>
    </div>

    <!-- Instructions -->
    <div class="instructions text-sm text-center max-w-xs">
      <p v-if="imageCaptured" class="text-green-500 font-medium">
        ✓ Image captured successfully!
      </p>
      <p v-else-if="multipleFacesDetected" class="text-red-500 font-medium">
        ❌ Multiple faces detected! Only one face allowed.
      </p>
      <p v-else-if="!faceDetected" class="text-red-500">
        ❌ No face detected
      </p>
      <p v-else-if="!isFaceCentered" class="text-yellow-500">
        ⬆️ Center your face in the circle
      </p>
      <p v-else-if="faceDistanceScore < 70" class="text-yellow-500">
        📏 Move slightly closer
      </p>
      <p v-else class="text-green-500 font-medium">
        ✓ Perfect! Capturing...
      </p>
    </div>

    <!-- Manual capture button as fallback -->
    <button 
      v-if="!imageCaptured && readyToCapture" 
      @click="captureImage"
      class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
    >
      Capture Image
    </button>

    <!-- Retake button -->
    <button 
      v-if="imageCaptured" 
      @click="retakePhoto"
      class="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
    >
      Retake Photo
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import * as faceapi from 'face-api.js'

const emit = defineEmits(['captured'])

const video = ref(null)
const canvas = ref(null)
const capturedImage = ref(null)
const imageCaptured = ref(false)
const cameraActive = ref(true)
const faceDistanceScore = ref(0)
const isFaceCentered = ref(false)
const faceDetected = ref(false)
const multipleFacesDetected = ref(false)

let mediaStream = null
let alertShown = false
let detectionInterval = null

// Frame settings
const FRAME_SIZE = 300
const CENTER_TOLERANCE = 20
const MIN_DISTANCE_SCORE = 70

const loadModels = async () => {
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector')
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68')
  } catch (error) {
    console.error('Failed to load face detection models:', error)
    alert('Failed to load face detection features. Please try refreshing the page.')
  }
}

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

const distance = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y)

const detectFaces = async () => {
  if (!video.value || video.value.readyState !== 4 || imageCaptured.value) return

  try {
    const videoElement = video.value
    let videoWidth = videoElement.videoWidth
    let videoHeight = videoElement.videoHeight
    
    // Handle iOS sometimes reporting 0 for dimensions
    if (videoWidth === 0 || videoHeight === 0) {
      videoWidth = FRAME_SIZE
      videoHeight = FRAME_SIZE
    }

    const detections = await faceapi
      .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()

    // Handle multiple faces
    if (detections.length > 1) {
      faceDetected.value = false
      isFaceCentered.value = false
      faceDistanceScore.value = 0
      multipleFacesDetected.value = true

      if (!alertShown) {
        alert('❌ Multiple faces detected. Please ensure only one face is visible.')
        alertShown = true
        setTimeout(() => { alertShown = false }, 3000)
      }
      return
    }

    multipleFacesDetected.value = false

    // No face detected
    if (detections.length === 0) {
      faceDetected.value = false
      isFaceCentered.value = false
      faceDistanceScore.value = 0
      return
    }

    faceDetected.value = true
    const detection = detections[0]
    const landmarks = detection.landmarks
    const nose = landmarks.getNose()[3]

    // Calculate position
    const videoRect = videoElement.getBoundingClientRect()
    const scaleX = videoWidth / videoRect.width
    const scaleY = videoHeight / videoRect.height

    const nosePosition = {
      x: nose.x / scaleX,
      y: nose.y / scaleY
    }

    // Calculate distance from center
    const center = { x: FRAME_SIZE / 2, y: FRAME_SIZE / 2 }
    const distToCenter = distance(nosePosition, center)

    // Calculate score (100% when perfectly centered)
    const maxDistance = FRAME_SIZE / 2
    faceDistanceScore.value = Math.max(0, 100 - (distToCenter / maxDistance) * 100)

    // Check if face is centered enough
    isFaceCentered.value = distToCenter <= CENTER_TOLERANCE

    // Auto-capture when conditions are met
    if (readyToCapture.value && !imageCaptured.value) {
      captureImage()
    }
  } catch (error) {
    console.error('Face detection error:', error)
  }
}

const captureImage = () => {
  const videoElement = video.value
  const canvasElement = canvas.value
  
  // Fix for iOS orientation issues
  let videoWidth = videoElement.videoWidth
  let videoHeight = videoElement.videoHeight
  
  // Handle iOS sometimes reporting 0 for dimensions
  if (videoWidth === 0 || videoHeight === 0) {
    videoWidth = FRAME_SIZE
    videoHeight = FRAME_SIZE
  }

  canvasElement.width = videoWidth
  canvasElement.height = videoHeight
  
  const ctx = canvasElement.getContext('2d')
  
  // Handle iOS mirroring
  ctx.save()
  if (isIOS()) {
    ctx.scale(-1, 1)
    ctx.drawImage(videoElement, -videoWidth, 0, videoWidth, videoHeight)
  } else {
    ctx.drawImage(videoElement, 0, 0, videoWidth, videoHeight)
  }
  ctx.restore()
  
  capturedImage.value = canvasElement.toDataURL('image/png')
  emit('captured', capturedImage.value)
  imageCaptured.value = true
  stopCamera()
}

const retakePhoto = () => {
  imageCaptured.value = false
  capturedImage.value = null
  startCamera()
}

const startCamera = async () => {
  try {
    // Updated media constraints for better cross-device support
    const constraints = {
      video: {
        width: { ideal: FRAME_SIZE },
        height: { ideal: FRAME_SIZE },
        facingMode: 'user',
        // Add these for better iOS support
        frameRate: { ideal: 30 }
      }
    }
    
    mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
    
    // iOS-specific video setup
    if (isIOS()) {
      video.value.setAttribute('playsinline', 'true')
      video.value.setAttribute('webkit-playsinline', 'true')
    }
    
    video.value.srcObject = mediaStream
    cameraActive.value = true
    
    // More robust loadeddata handling
    const onVideoReady = () => {
      // Fix for iOS sometimes not firing the event
      if (video.value.readyState >= 3) {
        startDetectionLoop()
      }
    }
    
    video.value.addEventListener('loadeddata', onVideoReady)
    // Fallback in case loadeddata doesn't fire
    setTimeout(onVideoReady, 1000)
    
  } catch (err) {
    console.error('Camera error:', err)
    // Handle permission denied on iOS
    if (err.name === 'NotAllowedError') {
      alert('Camera access was denied. Please enable camera permissions in your browser settings.')
    }
  }
}

const stopCamera = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
    cameraActive.value = false
  }
  if (detectionInterval) {
    clearInterval(detectionInterval)
    detectionInterval = null
  }
}

const startDetectionLoop = () => {
  // Clear any existing interval
  if (detectionInterval) {
    clearInterval(detectionInterval)
  }
  
  // Run detection immediately
  detectFaces()
  
  // Set up interval for continuous detection
  // Using interval instead of requestAnimationFrame for better mobile performance
  detectionInterval = setInterval(detectFaces, 300)
}

// Computed properties
const readyToCapture = computed(() => {
  return faceDetected.value &&
    isFaceCentered.value &&
    faceDistanceScore.value >= MIN_DISTANCE_SCORE
})

const facePositionStatus = computed(() => {
  if (imageCaptured.value) return 'Captured!'
  if (!faceDetected.value) return 'No face'
  if (!isFaceCentered.value) return 'Off center'
  if (faceDistanceScore.value < MIN_DISTANCE_SCORE) return 'Too far'
  return 'Perfect!'
})

onMounted(async () => {
  await loadModels()
  startCamera()
})

onBeforeUnmount(() => {
  stopCamera()
})
</script>

<style scoped>
.camera-wrapper {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
}

.camera-wrapper.border-blue-400 {
  border-color: #60a5fa;
}

.camera-wrapper.border-green-500 {
  border-color: #10b981;
}

.camera-video,
.camera-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* iOS-specific video styling */
.camera-video {
  transform: rotateY(180deg); /* Mirror the video */
  -webkit-transform: rotateY(180deg);
}

/* For non-iOS devices, we'll handle mirroring in canvas instead */
@media not all and (pointer: coarse) {
  .camera-video {
    transform: none;
    -webkit-transform: none;
  }
}

.center-guide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  z-index: 2;
}

.crosshair:before,
.crosshair:after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
}

.crosshair:before {
  width: 2px;
  height: 20px;
  left: 9px;
  top: 0;
}

.crosshair:after {
  width: 20px;
  height: 2px;
  left: 0;
  top: 9px;
}

.distance-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border: 2px dashed rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  transition: border-color 0.3s ease;
  z-index: 1;
}

.distance-ring.ring-green {
  border-color: rgba(0, 255, 0, 0.7);
}

/* Axis lines */
.axis-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

.x-axis {
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  transform: translateY(-50%);
}

.y-axis {
  left: 50%;
  top: 0;
  height: 100%;
  width: 1px;
  transform: translateX(-50%);
}

.status-indicators {
  min-width: 250px;
  background: rgba(0, 0, 0, 0.05);
  padding: 1%;
  border-radius: 8px;
}

.instructions p {
  margin: 0.3rem 0;
  padding: 0.2rem;
  border-radius: 4px;
}

/* Responsive adjustments */
@media (max-width: 400px) {
  .camera-wrapper {
    width: 280px;
    height: 280px;
  }
  
  .status-indicators {
    min-width: 220px;
  }
}
</style>