window.addEventListener("load", () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera({fov: 45, aspect: window.innerWidth/window.innerHeight});
    const renderer = new THREE.WebGLRenderer();
    const axes = new THREE.AxesHelper(1000)
    // renderer.setClearColor(0x0066ff);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.set(100, 100, 100);
    camera.lookAt(scene.position);
    scene.add(axes)
    document.getElementById("root").appendChild(renderer.domElement)
    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
})