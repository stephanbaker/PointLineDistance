function main() {
    // Setup our scene
    var scene = new THREE.Scene()
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 20
    var renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // Draw our line
    var material = new THREE.LineBasicMaterial({color: 0xBADA55})
    var geometry = new THREE.Geometry()
    var lineVector1 = new THREE.Vector3(0, -10, 0)
    var lineVector2 = new THREE.Vector3(0, 10, 0)
    geometry.vertices.push(lineVector1, lineVector2)
    var line = new THREE.Line(geometry, material)
    scene.add(line)

    // Create a parent for the points
    pointsContainer = new THREE.Object3D()
    scene.add(pointsContainer)

    // Generate our points and determine the closest to our line
    var closestDistance
    var closestSphere
    for(var i=0;i<10; i++) {
        var point = new THREE.Vector3(
            Math.random()*10 - 5, 
            Math.random()*10 - 5, 
            Math.random()*10 - 5
        )

        var mat = new THREE.MeshBasicMaterial({color: 0xCCCCCC})
        var sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32)
        var sphere = new THREE.Mesh(sphereGeometry, mat)
        sphere.position.set(point.x, point.y, point.z)
        pointsContainer.add(sphere)

        var distance = calculateDistance(point, lineVector1, lineVector2)
        if (!closestDistance || distance < closestDistance) {
            closestDistance = distance
            closestSphere = sphere
        }
    }
    closestSphere.material.color.setHex(0xBADA55)

    // Render loop
    var cameraRotation = 0
    function render() {
        requestAnimationFrame(render)
        cameraRotation -= 0.01
        pointsContainer.rotation.y = cameraRotation
        renderer.render(scene, camera)
    }
    render()
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180.0
}

function calculateDistance(v, l1, lv2) {
    // http://mathworld.wolfram.com/Point-LineDistance3-Dimensional.html
    //              |(x0-x1)x(x0-x2)|
    //  distance =  -----------------    
    //                  |x2-x1|
    //
    var diff1 = new THREE.Vector3(0,0,0).subVectors(v, l1)
    var diff2 = new THREE.Vector3(0,0,0).subVectors(v, lv2)
    var cross = new THREE.Vector3(0,0,0).crossVectors(diff1, diff2)
    var diff3 = new THREE.Vector3(0,0,0).subVectors(lv2, l1)
    return cross.length() / diff3.length()
}

main()