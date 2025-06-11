<template>
  <div class="page">
    <div class="neuron-network-container">
      <canvas ref="neuronCanvas" class="neuron-canvas"></canvas>
    </div>

    <div class="container_registration_box">
      <div class="main_container__form">
        <span class="text_form">
          <h1>Вход</h1>
        </span>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label class="text_form" for="username">Имя пользователя</label>
            <input
              v-model="form.username"
              type="text"
              id="username"
              placeholder="Введите имя пользователя"
              required
            />
          </div>
          <div class="form-group">
            <label class="text_form" for="password">Пароль</label>
            <input
              v-model="form.password"
              type="password"
              id="password"
              placeholder="Введите пароль"
              required
            />
          </div>
          <button type="submit" class="submit-button">Войти</button>
          <p v-if="error" class="error">{{ error }}</p>
          <p>Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link></p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../../../store/auth'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      error: '',
      neurons: [],
      connections: [],
      animationFrame: null,
      pulsingConnectionIndex: -1,
      pulseChangeTimer: 0,
      colors: {
        base: '#292F3F',
        pulse: '#FFFFFF'
      },
      config: {
        width: 1000,
        height: 900,
        padding: 70,
        minDistance: 80,
        maxConnections: 8,
        connectionDistance: 280
      }
    }
  },
  mounted() {
    this.initNeuronNetwork()
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    cancelAnimationFrame(this.animationFrame)
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    async handleLogin() {
      const authStore = useAuthStore()
      const { success, message } = await authStore.login(this.form)
      if (success) {
        this.$router.push('/main')
      } else {
        this.error = message
      }
    },

    initNeuronNetwork() {
      const canvas = this.$refs.neuronCanvas
      const container = document.querySelector('.neuron-network-container')

      container.style.width = `${this.config.width}px`
      container.style.height = `${this.config.height}px`
      canvas.width = this.config.width
      canvas.height = this.config.height

      this.createNeurons()
      this.createConnections()
      this.selectRandomPulsingElements()
      this.animate()
    },

    createNeurons() {
      this.neurons = []
      const fixedPositions = [
        { x: 120, y: 180 },
        { x: 280, y: 140 },
        { x: 400, y: 220 },
        { x: 520, y: 160 },
        { x: 180, y: 320 },
        { x: 300, y: 380 },
        { x: 460, y: 340 },
        { x: 600, y: 300 },
        { x: 140, y: 500 },
        { x: 260, y: 560 },
        { x: 380, y: 480 },
        { x: 500, y: 540 },
        { x: 620, y: 200 },
        { x: 740, y: 260 },
        { x: 860, y: 180 },
        { x: 680, y: 400 },
        { x: 560, y: 620 },
        { x: 800, y: 500 }
      ]

      fixedPositions.forEach((pos) => {
        this.neurons.push({
          x: pos.x,
          y: pos.y,
          radius: 6 + Math.random() * 4,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.3 + Math.random() * 0.4
        })
      })
    },

    createConnections() {
      this.connections = []

      for (let i = 0; i < this.neurons.length; i++) {
        let connectionCount = 0

        for (let j = i + 1; j < this.neurons.length; j++) {
          if (connectionCount >= this.config.maxConnections) break

          const dx = this.neurons[i].x - this.neurons[j].x
          const dy = this.neurons[i].y - this.neurons[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < this.config.connectionDistance) {
            this.connections.push({
              from: i,
              to: j,
              pulsePhase: Math.random() * Math.PI * 2,
              pulseSpeed: 0.2 + Math.random() * 0.3,
              width: 1.5 - distance / this.config.connectionDistance
            })
            connectionCount++
          }
        }
      }
    },

    selectRandomPulsingElements() {
      this.pulsingConnectionIndex = Math.floor(Math.random() * this.connections.length)
      const connection = this.connections[this.pulsingConnectionIndex]
      this.pulsingNeuronIndex = Math.random() < 0.5 ? connection.from : connection.to
      this.pulseChangeTimer = 0
    },

    animate() {
      const canvas = this.$refs.neuronCanvas
      const ctx = canvas.getContext('2d')

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      this.updatePulses()
      this.drawConnections(ctx)
      this.drawNeurons(ctx)

      this.animationFrame = requestAnimationFrame(this.animate)
    },

    updatePulses() {
      this.pulseChangeTimer += 0.05
      if (this.pulseChangeTimer > 15) {
        this.selectRandomPulsingElements()
      }

      if (this.pulsingNeuronIndex >= 0) {
        const neuron = this.neurons[this.pulsingNeuronIndex]
        neuron.pulsePhase += neuron.pulseSpeed * 0.05
        if (neuron.pulsePhase > Math.PI * 2) neuron.pulsePhase -= Math.PI * 2
      }

      if (this.pulsingConnectionIndex >= 0) {
        const connection = this.connections[this.pulsingConnectionIndex]
        connection.pulsePhase += connection.pulseSpeed * 0.05
        if (connection.pulsePhase > Math.PI * 2) connection.pulsePhase -= Math.PI * 2
      }
    },

    drawConnections(ctx) {
      ctx.lineCap = 'round'

      this.connections.forEach((conn, index) => {
        const from = this.neurons[conn.from]
        const to = this.neurons[conn.to]
        const isPulsing = index === this.pulsingConnectionIndex
        const intensity = isPulsing ? (Math.sin(conn.pulsePhase) + 1) / 2 : 0

        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = this.lerpColor(this.colors.base, this.colors.pulse, intensity * 0.6)
        ctx.lineWidth = (conn.width || 1) + (isPulsing ? intensity : 0)
        ctx.stroke()
      })
    },

    drawNeurons(ctx) {
      this.neurons.forEach((neuron, index) => {
        const isPulsing = index === this.pulsingNeuronIndex
        const intensity = isPulsing ? (Math.sin(neuron.pulsePhase) + 1) / 2 : 0

        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, neuron.radius + (isPulsing ? intensity * 4 : 0), 0, Math.PI * 2)
        ctx.fillStyle = this.lerpColor(this.colors.base, this.colors.pulse, intensity * 0.3)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, neuron.radius + (isPulsing ? intensity * 2 : 0), 0, Math.PI * 2)
        ctx.fillStyle = this.lerpColor(this.colors.base, this.colors.pulse, intensity)
        ctx.fill()
      })
    },

    lerpColor(color1, color2, factor) {
      if (factor <= 0) return color1
      if (factor >= 1) return color2

      const hex = (c) => parseInt(c.substring(1), 16)
      const r1 = hex(color1) >> 16
      const g1 = (hex(color1) >> 8) & 0xff
      const b1 = hex(color1) & 0xff

      const r2 = hex(color2) >> 16
      const g2 = (hex(color2) >> 8) & 0xff
      const b2 = hex(color2) & 0xff

      const r = Math.round(r1 + factor * (r2 - r1))
      const g = Math.round(g1 + factor * (g2 - g1))
      const b = Math.round(b1 + factor * (b2 - b1))

      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
    },

    handleResize() {
      this.initNeuronNetwork()
    }
  }
}
</script>

<style scoped>
.page {
  position: relative;
  display: flex;
  flex-direction: column;
  background-image: url(../assets/media/new_background.png);
  background-position: center;
  background-size: cover;
  align-items: center;
  color: #e6edf3;
  justify-content: center;
  background-color: #0d1117;
  min-height: 100vh;
  overflow-x: hidden;
}

.neuron-network-container {
  position: absolute;
  left: -150px;
  top: 30%;
  transform: translateY(-50%);
  width: 1000px;
  height: 900px;
  z-index: 0;
  opacity: 0.7;
  pointer-events: none;
}

.container_registration_box {
  position: relative;
  z-index: 1;
  padding: 43px;
  max-width: 600px;
  height: 400px;
  backdrop-filter: blur(5px);
  background: #ffffff12;
  border-radius: 15px;
  margin: auto;
}

.neuron-canvas {
  display: block;
  background: transparent;
  filter: drop-shadow(0 0 8px rgba(41, 47, 63, 0.7));
}

.text_form {
  font-family: 'Cabin', sans-serif;
  font-optical-sizing: auto;
}

.auth-form {
  width: 500px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.container_registration_box h1 {
  font-family: 'Cabin', sans-serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-size: 30px;
  margin-bottom: 20px;
  color: #e6edf3;
}

.error {
  color: #ff0000;
  font-size: 14px;
}

label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #c9d1d9;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #30363d;
  background-color: rgba(13, 17, 23, 0.7);
  color: #ffffff;
  font-size: 15px;
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #58a6ff;
  box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.2);
}

.submit-button {
  padding: 10px;
  border-radius: 8px;
  border: none;
  background-color: #58a6ff;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover {
  background-color: #388bfd;
}

.error {
  color: #f85149;
  font-size: 14px;
  text-align: center;
  font-family: 'Cabin', sans-serif;
  font-optical-sizing: auto;
}

a {
  color: #58a6ff;
  text-decoration: none;
  font-family: 'Cabin', sans-serif;
  font-optical-sizing: auto;
}

a:hover {
  text-decoration: underline;
}
</style>
