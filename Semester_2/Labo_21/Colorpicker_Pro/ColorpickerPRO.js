class StorageUtil {
    /*
      Read a value from localStorage and automatically parse JSON.
      Returns null if the key does not exist.
    */
    static get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    /*
      Save a value to localStorage as JSON.
    */
    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

class ColorpickerPRO {
    constructor() {
        this.state = {
            currentColor: '',
            channels: ['red', 'green', 'blue'],
            swatches: []
        };

        this.storage = {
            swatchesKey: 'colorPicker.colors',
            currentColorKey: 'colorPicker.currentColor'
        };

        this.elements = {};
        this.init();
    }

    init() {
        /*
          Grab all DOM elements first.
          Then load saved swatches and the saved current color.
          After that, attach event listeners and render everything once.
        */
        this.initElements();
        this.loadSavedSwatches();
        this.loadSavedColor();
        this.setupEventListeners();
        this.updateBackground();
    }

    initElements() {
        this.elements.backgroundBlobs = document.querySelector('#background-blobs');
        this.elements.colorBox = document.querySelector('#color-box');
        this.elements.swatchBox = document.querySelector('#swatch-box');
        this.elements.saveButton = document.querySelector('#save-button');
        this.elements.hexDisplay = document.querySelector('#hexDisplay');

        /*
          Build a small object per RGB slider so we can easily loop through them.
        */
        this.elements.sliders = this.state.channels.map(channel => ({
            channel,
            slider: document.querySelector(`#${channel}-slider`),
            value: document.querySelector(`#${channel}-value`)
        }));
    }

    setupEventListeners() {
        /*
          Update the current color live whenever the user drags a slider.
        */
        this.elements.sliders.forEach(({ slider }) => {
            slider.addEventListener('input', () => this.updateColorFromSliders());
        });

        /*
          Save the current color as a swatch.
        */
        this.elements.saveButton.addEventListener('click', () => this.saveCurrentColor());

        /*
          Clicking the preview copies the hex code.
        */
        this.elements.colorBox.addEventListener('click', () => this.copyColorToClipboard());

        /*
          When the screen size changes, rebuild the animated background.
          This helps the blobs continue to cover the full viewport correctly.
        */
        window.addEventListener('resize', () => this.updateBackground());
    }

    updateColorFromSliders() {
        /*
          Read the three slider values, update the visible numbers,
          then create an rgb(...) string from them.
        */
        const values = this.elements.sliders.map(({ slider, value }) => {
            const sliderValue = Number(slider.value);
            value.textContent = sliderValue;
            return sliderValue;
        });

        const color = `rgb(${values.join(', ')})`;
        this.setColor(color);
    }

    setColor(color) {
        /*
          Update internal state and preview box.
        */
        this.state.currentColor = color;
        this.elements.colorBox.style.backgroundColor = color;
        this.elements.hexDisplay.textContent = ColorpickerPRO.rgbToHex(color);

        /*
          If this color came from storage or from clicking a swatch,
          parse the rgb string and sync the slider positions too.
        */
        const rgb = ColorpickerPRO.parseRGB(color);
        if (rgb) {
            this.updateSliders(...rgb);
        }

        StorageUtil.set(this.storage.currentColorKey, color);
    }

    updateSliders(r, g, b) {
        /*
          Synchronize the actual range inputs and numeric text labels.
        */
        const values = [r, g, b];

        this.elements.sliders.forEach(({ slider, value }, index) => {
            slider.value = values[index];
            value.textContent = values[index];
        });
    }

    static parseRGB(color) {
        /*
          Extract numeric channel values from strings like:
          "rgb(255, 128, 64)"
        */
        const match = color.match(/\d+/g);
        return match ? match.map(Number) : null;
    }

    static rgbToHex(rgb) {
        /*
          Convert "rgb(r, g, b)" to "#rrggbb"
        */
        const numbers = rgb.match(/\d+/g).map(Number);

        return '#' + numbers
            .map(value => value.toString(16).padStart(2, '0'))
            .join('');
    }

    loadSavedColor() {
        /*
          Restore the previously active color if it exists.
          If not, use the current slider defaults from the HTML.
        */
        const savedColor = StorageUtil.get(this.storage.currentColorKey);

        if (savedColor) {
            this.setColor(savedColor);
        } else {
            this.updateColorFromSliders();
        }
    }

    loadSavedSwatches() {
        /*
          Restore saved swatches from localStorage and render them.
        */
        this.state.swatches = StorageUtil.get(this.storage.swatchesKey) || [];
        this.state.swatches.forEach(color => this.addToSwatches(color));
    }

    saveCurrentColor() {
        /*
          Prevent duplicate swatches.
        */
        if (this.state.swatches.includes(this.state.currentColor)) {
            return;
        }

        this.state.swatches.push(this.state.currentColor);
        StorageUtil.set(this.storage.swatchesKey, this.state.swatches);

        this.addToSwatches(this.state.currentColor);
        this.updateBackground();
    }

    addToSwatches(color) {
        /*
          Create a clickable swatch tile.
          Clicking the tile restores that color.
        */
        const swatch = document.createElement('div');
        swatch.className = 'swatch-item';
        swatch.style.backgroundColor = color;
        swatch.title = color;

        swatch.addEventListener('click', () => {
            this.setColor(color);
        });

        /*
          Add a small remove button to each swatch.
          stopPropagation() prevents the click from also selecting the swatch color.
        */
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-button';
        removeButton.type = 'button';
        removeButton.textContent = '✖';

        removeButton.addEventListener('click', event => {
            event.stopPropagation();

            const index = this.state.swatches.indexOf(color);

            if (index !== -1) {
                this.state.swatches.splice(index, 1);
                StorageUtil.set(this.storage.swatchesKey, this.state.swatches);
            }

            swatch.remove();
            this.updateBackground();
        });

        swatch.appendChild(removeButton);
        this.elements.swatchBox.appendChild(swatch);
    }

    updateBackground() {
        /*
          Rebuild the whole animated background from the currently saved swatches.

          Why rebuild?
          Because when colors are added or removed, it is easier and cleaner
          to recreate the blobs than to carefully diff them.
        */
        const container = this.elements.backgroundBlobs;
        container.innerHTML = '';

        /*
          If there are no saved swatches, we leave the base page background visible.
        */
        if (this.state.swatches.length === 0) {
            return;
        }

        /*
          Each layer has:
          - a class for animation speed
          - a number of blobs
          - a size range

          Bigger, slower blobs feel farther away.
          Smaller, faster blobs feel closer.
        */
        const layers = [
            { className: 'layer-1', count: 5, minSize: 420, maxSize: 700 },
            { className: 'layer-2', count: 6, minSize: 300, maxSize: 520 },
            { className: 'layer-3', count: 7, minSize: 220, maxSize: 400 }
        ];

        layers.forEach(layer => {
            for (let i = 0; i < layer.count; i++) {
                const blob = document.createElement('div');
                blob.className = `blob ${layer.className}`;

                /*
                  Pick a random saved color for each blob.
                */
                const color = this.state.swatches[
                    Math.floor(Math.random() * this.state.swatches.length)
                    ];

                blob.style.background = color;

                /*
                  IMPORTANT:
                  We use viewport-based pixel positioning here instead of % plus translate(-50%, -50%).
                  This prevents the "everything stays on the left" problem.

                  We also allow some blobs to start slightly off-screen.
                  That makes the effect feel more natural and fills the edges better.
                */
                const size = ColorpickerPRO.randomBetween(layer.minSize, layer.maxSize);
                const x = ColorpickerPRO.randomBetween(-size * 0.25, window.innerWidth - size * 0.75);
                const y = ColorpickerPRO.randomBetween(-size * 0.25, window.innerHeight - size * 0.75);

                blob.style.width = `${size}px`;
                blob.style.height = `${size}px`;
                blob.style.left = `${x}px`;
                blob.style.top = `${y}px`;

                /*
                  Animation delay is randomized so all blobs do not move in sync.
                */
                blob.style.animationDelay = `${ColorpickerPRO.randomBetween(0, 20)}s`;

                container.appendChild(blob);
            }
        });
    }

    copyColorToClipboard() {
        const hex = ColorpickerPRO.rgbToHex(this.state.currentColor);

        navigator.clipboard.writeText(hex)
            .then(() => {
                const oldText = this.elements.hexDisplay.textContent;
                this.elements.hexDisplay.textContent = 'Copied!';

                setTimeout(() => {
                    this.elements.hexDisplay.textContent = oldText;
                }, 1200);
            })
            .catch(() => {
                const oldText = this.elements.hexDisplay.textContent;
                this.elements.hexDisplay.textContent = 'Copy failed';

                setTimeout(() => {
                    this.elements.hexDisplay.textContent = oldText;
                }, 1200);
            });
    }

    static randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
}

/*
  Initialize the app once the page is ready.
*/
window.addEventListener('load', () => {
    new ColorpickerPRO();
});