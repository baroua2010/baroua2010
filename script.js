document.addEventListener('DOMContentLoaded', function() {
    console.log('تطبيق حرفيون جاهز للعمل!');

    const googleLoginButton = document.getElementById('googleLogin');
    if (googleLoginButton) {
        googleLoginButton.addEventListener('click', function() {
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    alert('تم تسجيل الدخول بنجاح!');
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    console.error('خطأ في تسجيل الدخول:', error);
                    alert('حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.');
                });
        });
    }

    const db = firebase.firestore();
    const storage = firebase.storage();

    const addServiceForm = document.getElementById('addServiceForm');

    if (addServiceForm) {
        addServiceForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const serviceName = document.getElementById('serviceName').value;
            const serviceDescription = document.getElementById('serviceDescription').value;
            const servicePrice = document.getElementById('servicePrice').value;
            const servicePhone = document.getElementById('servicePhone').value;
            const serviceCategory = document.getElementById('serviceCategory').value;
            const serviceImageFile = document.getElementById('serviceImage').files[0];

            if (!serviceImageFile) {
                alert('يرجى تحميل صورة للخدمة.');
                return;
            }

            const storageRef = storage.ref();
            const imageRef = storageRef.child(`images/${serviceImageFile.name}`);

            imageRef.put(serviceImageFile).then(() => {
                return imageRef.getDownloadURL();
            }).then((imageUrl) => {
                return db.collection('services').add({
                    name: serviceName,
                    description: serviceDescription,
                    price: servicePrice,
                    phone: servicePhone,
                    category: serviceCategory,
                    image: imageUrl,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }).then((docRef) => {
                console.log('تم إضافة الخدمة بنجاح:', docRef.id);
                window.location.href = `service.html?id=${docRef.id}`;
            }).catch((error) => {
                console.error('خطأ في إضافة الخدمة:', error);
            });
        });
    }

    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        db.collection('services').orderBy('createdAt', 'desc').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const service = doc.data();
                const serviceElement = document.create