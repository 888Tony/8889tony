document.addEventListener('DOMContentLoaded', () => {
    const views = document.querySelectorAll('.view');
    const goButton = document.getElementById('goButton');
    const backToView1 = document.getElementById('backToView1');
    const nextToView3 = document.getElementById('nextToView3');
    const backToView2 = document.getElementById('backToView2');
    const nextToView4 = document.getElementById('nextToView4');
    const timer = document.getElementById('timer');
    const nextToView5 = document.getElementById('nextToView5');
    const nextToView3Again = document.getElementById('nextToView3Again');
    const motivationNo = document.getElementById('motivationNo');
    const stepsTableBody = document.getElementById('stepsTableBody');
    let timerStarted = false;
    let startTime, timerInterval;
    let elapsedTime = 0; // New variable to keep track of elapsed time

    let steps = [];
    let stepNumber = 1;

    const showView = (viewIndex) => {
        views.forEach((view, index) => {
            view.classList.toggle('active', index === viewIndex);
        });
    };

    const updateStepView = () => {
        document.getElementById('view3').querySelector('h1').textContent = `${ordinalSuffix(stepNumber)} step`;
        document.getElementById('view3').querySelector('h2').textContent = `What is Your ${ordinalSuffix(stepNumber)}, most EASY, most SHORT step to begin?`;
    };

    const ordinalSuffix = (i) => {
        const j = i % 10, k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    };

    const formatTime = (duration) => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const startTimer = () => {
        startTime = new Date();
        timerInterval = setInterval(() => {
            const now = new Date();
            elapsedTime += Math.floor((now - startTime) / 1000);
            timer.textContent = `Time: ${formatTime(elapsedTime)}`;
            startTime = now;
        }, 1000);
    };

    const stopTimer = () => {
        clearInterval(timerInterval);
    };

    goButton.addEventListener('click', () => {
        showView(1);
    });

    backToView1.addEventListener('click', () => {
        showView(0);
    });

    nextToView3.addEventListener('click', () => {
        const mainTask = document.getElementById('mainTask').value;
        localStorage.setItem('mainTask', mainTask);
        updateStepView();
        showView(2);
    });

    backToView2.addEventListener('click', () => {
        showView(1);
    });

    nextToView4.addEventListener('click', () => {
        const firstStep = document.getElementById('firstStep').value;
        localStorage.setItem('firstStep', firstStep);
        document.getElementById('stepDisplay').textContent = `${stepNumber}. ${firstStep}`;
        showView(3);
    });

    timer.addEventListener('click', () => {
        if (!timerStarted) {
            timerStarted = true;
            timer.textContent = 'Pause Timer';
            startTimer();
        } else {
            timerStarted = false;
            stopTimer();
            timer.textContent = `Resume Timer ${formatTime(elapsedTime)}`;
            nextToView5.classList.remove('hidden');
        }
    });

    nextToView5.addEventListener('click', () => {
        timer.textContent = 'Start Timer'; //I added this
        stopTimer();
        const duration = elapsedTime.toFixed(2);
        const firstStep = localStorage.getItem('firstStep');
        steps.push({
            step: stepNumber,
            title: firstStep,
            duration
        });
        localStorage.setItem('steps', JSON.stringify(steps));
        const mainTask = localStorage.getItem('mainTask');
        document.getElementById('mainTaskDisplay').textContent = mainTask;
        stepsTableBody.innerHTML = '';
        steps.forEach(step => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${step.step}</td><td>${step.title}</td><td>${step.duration}s</td>`;
            stepsTableBody.appendChild(row);
        });
        showView(4);
    });

    nextToView3Again.addEventListener('click', () => {
        stepNumber++;
        elapsedTime = 0; // Reset elapsed time for the next step
        updateStepView();
        showView(2);
    });

    motivationNo.addEventListener('change', () => {
        if (motivationNo.checked) {
            alert('Congratulations! You have finished your task.');
            window.close();
        }
    });
});
