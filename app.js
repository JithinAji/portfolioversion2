// Minimal component helpers and two small demos (Reactivity & JSON Engine)
const el = (tag, props = {}, ...children) => {
    const d = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
        if (k.startsWith('on') && typeof v === 'function') d.addEventListener(k.slice(2).toLowerCase(), v);
        else if (k === 'class') d.className = v;
        else d.setAttribute(k, v);
    });
    children.flat().forEach(c => d.append(typeof c === 'string' ? document.createTextNode(c) : c));
    return d;
};

document.addEventListener('DOMContentLoaded', () => {
    mountReactivityDemo(document.getElementById('reactivity-demo'));
    mountJSONDemo(document.getElementById('json-demo'));
});

/* ----------------- Reactivity Playground ----------------- */
function mountReactivityDemo(root) {
    if (!root) return;
    root.innerHTML = '';

    const select = el('select', {},
        el('option', { value: 'manual' }, 'Manual'),
        el('option', { value: 'define' }, 'Object.defineProperty'),
        el('option', { value: 'proxy' }, 'Proxy')
    );

    const input = el('input', { type: 'text', value: 'hello' });
    const out = el('div', { class: 'code' }, 'value: ');
    const logs = el('pre', { class: 'muted' }, 'changes will appear here');

    root.append(el('div', { class: 'demo-row' }, select, input), out, logs);

    // Manual approach
    function setupManual() {
        out.textContent = 'value: ' + input.value;
        const handler = () => { out.textContent = 'value: ' + input.value; logs.textContent = 'manual update -> ' + input.value; };
        input.removeEventListener('input', handler);
        input.addEventListener('input', handler);
    }

    // defineProperty approach
    function setupDefine() {
        const obj = {};
        let internal = input.value;
        Object.defineProperty(obj, 'v', {
            get() { return internal },
            set(n) { internal = n; out.textContent = 'value: ' + n; logs.textContent = 'defineProperty -> ' + n }
        });
        input.addEventListener('input', e => obj.v = e.target.value);
        out.textContent = 'value: ' + obj.v;
    }

    // Proxy approach
    function setupProxy() {
        const state = { v: input.value };
        const p = new Proxy(state, {
            set(target, key, value) {
                target[key] = value;
                out.textContent = 'value: ' + value;
                logs.textContent = 'proxy -> ' + value;
                return true;
            }
        });
        input.addEventListener('input', e => p.v = e.target.value);
        out.textContent = 'value: ' + state.v;
    }

    function apply() {
        out.textContent = '';
        logs.textContent = '';
        // detach listeners by replacing node
        const newInput = input.cloneNode();
        input.replaceWith(newInput);
        // update reference
        root.querySelector('input');
        if (select.value === 'manual') setupManual();
        if (select.value === 'define') setupDefine();
        if (select.value === 'proxy') setupProxy();
    }

    // initial
    input.addEventListener('input', () => out.textContent = 'value: ' + input.value);
    select.addEventListener('change', apply);
    // bootstrap first mode
    apply();
}

/* ----------------- JSON Engine (simple) ----------------- */
function mountJSONDemo(root) {
    if (!root) return;
    root.innerHTML = '';

    // Simple JSON engine with path updates, listeners, batching and undo/redo
    class JSONEngine {
        constructor(initial = {}) {
            this.state = JSON.parse(JSON.stringify(initial));
            this.listeners = new Map();
            this.history = [];
            this.redoStack = [];
            this._batch = false;
            this._batched = [];
        }
        get() { return this.state }
        _notify(path) {
            (this.listeners.get(path) || []).forEach(fn => fn(this.getAt(path)));
            if (!this._batch && this._batched.length) { this._batched = [] }
        }
        on(path, fn) { this.listeners.set(path, (this.listeners.get(path) || []).concat(fn)); return () => this.off(path, fn) }
        off(path, fn) { this.listeners.set(path, (this.listeners.get(path) || []).filter(f => f !== fn)) }
        getAt(path) { if (!path) return this.state; return path.split('.').reduce((s, k) => s && s[k], this.state) }
        setAt(path, value) {
            const prev = JSON.parse(JSON.stringify(this.getAt(path)));
            const parts = path.split('.');
            let obj = this.state;
            for (let i = 0; i < parts.length - 1; i++) { const k = parts[i]; if (!(k in obj)) obj[k] = {}; obj = obj[k] }
            const key = parts[parts.length - 1];
            obj[key] = value;
            const cmd = { path, prev, next: value };
            this.history.push(cmd);
            this.redoStack = [];
            if (this._batch) this._batched.push(cmd); else this._notify(path);
        }
        batch(fn) { this._batch = true; try { fn() } finally { this._batch = false; this._batched.forEach(c => this._notify(c.path)); this._batched = [] } }
        undo() { const cmd = this.history.pop(); if (!cmd) return; const parts = cmd.path.split('.'); let obj = this.state; for (let i = 0; i < parts.length - 1; i++) { obj = obj[parts[i]] } obj[parts[parts.length - 1]] = cmd.prev; this.redoStack.push(cmd); this._notify(cmd.path) }
        redo() { const cmd = this.redoStack.pop(); if (!cmd) return; this.setAt(cmd.path, cmd.next) }
    }

    const engine = new JSONEngine({ a: { count: 0 }, user: { name: 'alice' } });

    const stateView = el('pre', { class: 'muted' }, JSON.stringify(engine.get(), null, 2));
    const form = el('div', { class: 'json-form' },
        el('input', { type: 'text', placeholder: 'path (e.g. a.count)', id: 'path' }),
        el('input', { type: 'text', placeholder: 'value', id: 'value' }),
        el('button', {}, 'apply'),
        el('button', {}, 'batch+apply'),
        el('button', {}, 'undo'),
        el('button', {}, 'redo')
    );

    root.append(form, stateView);

    // wire
    const [pathIn, valueIn, applyBtn, batchBtn, undoBtn, redoBtn] = Array.from(form.querySelectorAll('input,button'));

    function refresh() { stateView.textContent = JSON.stringify(engine.get(), null, 2) }
    applyBtn.addEventListener('click', () => {
        const path = pathIn.value.trim(); let v = parseMaybe(valueIn.value);
        if (!path) return; engine.setAt(path, v); refresh();
    });
    batchBtn.addEventListener('click', () => {
        engine.batch(() => {
            try { engine.setAt('a.count', (engine.getAt('a.count') || 0) + 1) } catch (e) { }
            try { engine.setAt('user.name', valueIn.value || engine.getAt('user.name')) } catch (e) { }
        });
        refresh();
    });
    undoBtn.addEventListener('click', () => { engine.undo(); refresh() });
    redoBtn.addEventListener('click', () => { engine.redo(); refresh() });

    // helper to parse values simply
    function parseMaybe(v) { if (v === 'true') return true; if (v === 'false') return false; if (v === 'null') return null; if (!isNaN(Number(v))) return Number(v); return v }

    // expose small API for demo visibility
    root.append(el('div', { style: 'margin-top:8px;color:var(--muted);font-size:13px' }, 'Try path: ', el('code', {}, 'a.count'), ' or ', el('code', {}, 'user.name')));
}
