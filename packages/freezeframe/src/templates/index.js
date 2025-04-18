export const container = () => `
  <div class="freezeframe-container">
    <div class="freezeframe-loading-icon"></div>
  </div>
`;

export const canvas = () => `
  <canvas class="freezeframe-canvas"></canvas>
`;

export const overlay = () => `
  <div class="freezeframe-overlay">
    <div class="freezeframe-overlay-content">
      <span class="freezeframe-overlay-icon"></span>
    </div>
  </div>
`;

export const stylesheet = () => `
  <style id="freezeframe-styles">
    .freezeframe-container {
      position: relative;
      display: inline-block;
      overflow: hidden;
    }
    .freezeframe-canvas {
      display: block;
      max-width: 100%;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .freezeframe-canvas.freezeframe-canvas-ready {
      opacity: 1;
    }
    .freezeframe-container.freezeframe-ready {
      background: transparent;
    }
    .freezeframe-container.freezeframe-ready .freezeframe-loading-icon {
      display: none;
    }
    .freezeframe-container.freezeframe-active .freezeframe-image {
      opacity: 1;
    }
    .freezeframe-container.freezeframe-inactive .freezeframe-image {
      opacity: 0;
    }
    .freezeframe-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .freezeframe-container:hover .freezeframe-overlay {
      opacity: 1;
    }
  </style>
`; 