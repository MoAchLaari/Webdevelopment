class StorageUtil {
    static get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

class ColorpickerPRO {
    constructor() {
        this.state = {
            currentColor: '',
            colors: ['red', 'green', 'blue'],
            swatches: []
        };

        this.storage = {
            swatchesKey: 'colorPicker.colors',
            currentColorKey: 'colorPicker.sliderValues'
        };

        this.elements = {};
        this.init();
    }

    init() {
        this.initElements();
        this.loadSavedSwatches();
        this.loadSavedColor();
        this.setupEventListeners();
        this.updateColorFromSliders();
        this.updateBackground();
    }

    initElements() {
        this.elements.colorBox = document.querySelector('#color-box');
        this.elements.swatchBox = document.querySelector('#swatch-box');
        this.elements.saveButton = document.querySelector('#save-button');
        this.elements.hexDisplay = document.querySelector('#hexDisplay');
        this.elements.body = document.body;

        this.elements.sliders = this.state.colors.map(color => ({
            slider: document.querySelector(`#${color}-slider`),
            value: document.querySelector(`#${color}-value`)
        }));
    }

    setupEventListeners() {
        this.elements.sliders.forEach(({ slider }) => {
            slider.addEventListener('input', () => this.updateColorFromSliders());
        });

        this.elements.saveButton.addEventListener('click', () => this.saveCurrentColor());

        this.elements.colorBox.addEventListener('click', () => this.copyColorToClipboard());
    }

    setColor(color) {
        this.state.currentColor = color;
        this.elements.colorBox.style.backgroundColor = color;
        this.elements.hexDisplay.textContent = ColorpickerPRO.rgbToHex(color);

        const rgb = ColorpickerPRO.parseRGB(color);
        if (rgb) this.updateSliders(...rgb);

        StorageUtil.set(this.storage.currentColorKey, color);
    }

    updateColorFromSliders() {
        const values = this.elements.sliders.map(({ slider, value }) => {
            value.textContent = slider.value;
            return slider.value;
        });

        this.setColor(`rgb(${values.join(',')})`);
    }

    updateSliders(r, g, b) {
        [r, g, b].forEach((val, i) => {
            this.elements.sliders[i].slider.value = val;
            this.elements.sliders[i].value.textContent = val;
        });
    }

    static parseRGB(color) {
        const match = color.match(/\d+/g);
        return match ? match.map(Number) : null;
    }

    saveCurrentColor() {
        if (this.state.swatches.includes(this.state.currentColor)) return;

        this.state.swatches.push(this.state.currentColor);
        this.addToSwatches(this.state.currentColor);
        StorageUtil.set(this.storage.swatchesKey, this.state.swatches);

        this.updateBackground();
    }

    addToSwatches(color) {
        const swatch = document.createElement('div');
        swatch.className = 'swatch-item';
        swatch.style.backgroundColor = color;

        swatch.addEventListener('click', () => this.setColor(color));

        const remove = document.createElement('button');
        remove.className = 'remove-button';
        remove.textContent = '✖';

        remove.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = Array.from(this.elements.swatchBox.children).indexOf(swatch);

            this.state.swatches.splice(index, 1);
            StorageUtil.set(this.storage.swatchesKey, this.state.swatches);

            swatch.remove();
            this.updateBackground();
        });

        swatch.appendChild(remove);
        this.elements.swatchBox.appendChild(swatch);
    }

    loadSavedSwatches() {
        this.state.swatches = StorageUtil.get(this.storage.swatchesKey) || [];
        this.state.swatches.forEach(color => this.addToSwatches(color));
    }

    loadSavedColor() {
        const saved = StorageUtil.get(this.storage.currentColorKey);
        this.setColor(saved || 'rgb(0,0,0)');
    }

    updateBackground() {
        const container = document.getElementById('background-blobs');

        // Clear old blobs
        container.innerHTML = '';

        if (this.state.swatches.length === 0) return;

        this.state.swatches.forEach(color => {
            const blob = document.createElement('div');
            blob.className = 'blob';

            blob.style.background = color;

            // Random position
            blob.style.top = Math.random() * 80 + '%';
            blob.style.left = Math.random() * 80 + '%';

            // Random animation delay for variation
            blob.style.animationDelay = (Math.random() * 10) + 's';

            // Random size variation
            const size = 250 + Math.random() * 200;
            blob.style.width = size + 'px';
            blob.style.height = size + 'px';

            container.appendChild(blob);
        });
    }

    static rgbToHex(rgb) {
        return "#" + rgb.match(/\d+/g)
            .map(x => (+x).toString(16).padStart(2, '0'))
            .join('');
    }
}


window.addEventListener('load', () => new ColorpickerPRO());