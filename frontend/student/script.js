document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  const notificationBtn = document.getElementById('notificationBtn');
  
  document.getElementById('student-name').textContent = 'Anshuman';
  
  notificationBtn.addEventListener('click', () => {
    showNotification('No new notifications!');
  });
  
  logoutBtn.addEventListener('click', () => {
    showNotification('Logging out...', 'info');
    setTimeout(() => {
      showNotification('Logged out successfully!', 'success');
    }, 1000);
  });
  
  setupCourseSlider();
  
  setupPageNavigation();
  
  loadAnnouncements();
});

function setupPageNavigation() {
  document.querySelectorAll('.menu-item[data-page]').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const targetPage = this.getAttribute('data-page');
      navigateToPage(targetPage);
    });
  });
  
  document.querySelectorAll('.back-btn[data-return]').forEach(btn => {
    btn.addEventListener('click', function() {
      const returnTo = this.getAttribute('data-return');
      navigateToPage(returnTo);
    });
  });
  
  document.querySelector('.see-all-btn').addEventListener('click', function() {
    navigateToPage('my-courses');
  });
}

function navigateToPage(pageId) {
  document.querySelector('.dashboard-container').style.display = 'none';
  
  document.querySelectorAll('.page-content').forEach(section => {
    section.style.display = 'none';
  });
  
  if (pageId === 'dashboard') {
    document.querySelector('.dashboard-container').style.display = 'flex';
    return;
  }
  
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.style.display = 'block';
    
    const pageName = targetPage.querySelector('.page-title h2').textContent;
    showNotification(`Viewing ${pageName}`);
  }
}

function setupCourseSlider() {
  const slider = document.querySelector('.course-slider');
  const nextBtn = document.querySelector('.next-btn');
  let position = 0;
  
  nextBtn.addEventListener('click', () => {
    position += 320;
    
    if (position >= slider.scrollWidth - slider.clientWidth) {
      position = 0;
    }
    
    slider.scrollTo({
      left: position,
      behavior: 'smooth'
    });
  });
  
  document.querySelectorAll('.enroll-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const courseName = this.closest('.course-card').querySelector('h4').textContent;
      showNotification(`Enrolled in ${courseName}`, 'success');
      this.textContent = 'Enrolled';
      this.disabled = true;
      this.style.backgroundColor = '#5c6b7a';
    });
  });
  
  document.querySelectorAll('.continue-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const courseName = this.closest('.enrolled-course').querySelector('h3').textContent;
      showNotification(`Continuing ${courseName}`, 'info');
    });
  });
}

function loadAnnouncements() {
  const announcementList = document.getElementById('announcementList');
  
  let announcements = localStorage.getItem('pravaah_announcements');
  
  if (announcements) {
    announcements = JSON.parse(announcements);
    renderAnnouncements(announcements);
  } else {
    const defaultAnnouncements = [
      { date: 'May 1', text: 'Semester exams start May 15.' },
      { date: 'Apr 5', text: 'Maintenance on April 10, 1–3 AM.' },
      { date: 'Mar 28', text: 'New course on Data Science added.' }
    ];
    
    localStorage.setItem('pravaah_announcements', JSON.stringify(defaultAnnouncements));
    renderAnnouncements(defaultAnnouncements);
  }

}

function renderAnnouncements(announcements) {
  const announcementList = document.getElementById('announcementList');
  announcementList.innerHTML = '';
  
  announcements.forEach(announcement => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="announcement-date">${announcement.date}</span> 📢 ${announcement.text}`;
    announcementList.appendChild(li);
  });
}

window.addEventListener('storage', function(e) {
  if (e.key === 'pravaah_announcements') {
    loadAnnouncements();
    showNotification('New announcement received!', 'info');
  }
});

function showNotification(message, type = 'info') {
  let container = document.querySelector('.notification-container');
  
  if (!container) {
    container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
    
    if (!document.getElementById('notification-style')) {
      const style = document.createElement('style');
      style.id = 'notification-style';
      style.textContent = `
        :root {
          --primary: #2c7be5;
          --primary-light: #5295ea;
          --primary-dark: #1a68c7;
          --accent: #00d0b0;
          --light: #f5f8fb;
          --dark: #1e2e42;
          --text-light: #ffffff;
          --text-dark: #333333;
        }
        .notification-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
        }
        .notification {
          background: var(--primary-dark);
          color: var(--text-light);
          border-radius: 8px;
          padding: 12px 24px;
          margin-bottom: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transform: translateX(120%);
          animation: slide-in 0.3s forwards, fade-out 0.3s 2.7s forwards;
          display: flex;
          align-items: center;
        }
        .notification.error {
          border-left: 4px solid #e74c3c;
        }
        .notification.success {
          border-left: 4px solid var(--accent);
        }
        .notification.info {
          border-left: 4px solid var(--primary-light);
        }
        @keyframes slide-in {
          100% { transform: translateX(0); }
        }
        @keyframes fade-out {
          100% { opacity: 0; transform: translateX(120%); }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  container.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
} 