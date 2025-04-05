document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const notificationBtn = document.getElementById('notificationBtn');
  let isLoggedIn = false;
  
  loginBtn.addEventListener('click', () => {
    isLoggedIn = !isLoggedIn;
    loginBtn.textContent = isLoggedIn ? 'Log Out' : 'Log In';
    
    showNotification(isLoggedIn ? 'Successfully logged in!' : 'Logged out successfully!');
  });
  
  notificationBtn.addEventListener('click', () => {
    showNotification('No new notifications!');
  });
  
  setupPageNavigation();
  
  document.querySelectorAll('.action-btn').forEach(button => {
    if (!button.hasAttribute('data-page')) {
      button.addEventListener('click', function() {
        const action = this.textContent.split(' ')[0];
        const cardTitle = this.closest('.card').querySelector('h3').textContent;
        showNotification(`${action} ${cardTitle}`);
      });
    }
  });
  
  setupSampleInteractions();
  
  initializeAnnouncements();
});

function setupPageNavigation() {
  document.querySelectorAll('.action-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetPage = this.getAttribute('data-page');
      navigateToPage(targetPage);
    });
  });
  
  // Navigation back to dashboard
  document.querySelectorAll('.back-btn[data-return]').forEach(btn => {
    btn.addEventListener('click', function() {
      const returnTo = this.getAttribute('data-return');
      navigateToPage(returnTo);
    });
  });
}

function navigateToPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.main-content > section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Show target page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.style.display = pageId === 'dashboard' ? 'flex' : 'block';
    
    // Show notification when navigating
    if (pageId !== 'dashboard') {
      const pageName = targetPage.querySelector('.page-title h2').textContent;
      showNotification(`Viewing ${pageName}`);
    }
  }
}

// Setup sample interactions for demonstration
function setupSampleInteractions() {
  // Handle add new buttons
  document.querySelectorAll('.add-new-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const pageTitle = this.closest('.page-content').querySelector('.page-title h2').textContent;
      showNotification(`Add new item to ${pageTitle}`, 'info');
    });
  });
  
  // Handle table action buttons
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', function() {
      const rowData = this.closest('tr').cells[1].textContent;
      showNotification(`Editing: ${rowData}`, 'info');
    });
  });
  
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', function() {
      const rowData = this.closest('tr').cells[1].textContent;
      showNotification(`Delete: ${rowData}?`, 'error');
    });
  });
}

// Initialize announcements from localStorage or with defaults
function initializeAnnouncements() {
  const announcementList = document.getElementById('announcementList');
  
  // Check if there are announcements in localStorage
  let announcements = localStorage.getItem('pravaah_announcements');
  
  if (!announcements) {
    // If no announcements in localStorage, save the current ones
    const currentAnnouncements = [];
    
    // Get existing announcements from the DOM
    document.querySelectorAll('#announcementList li').forEach(li => {
      const dateSpan = li.querySelector('.announcement-date');
      const date = dateSpan ? dateSpan.textContent : 'Unknown';
      
      // Extract the announcement text (remove the date span and emoji)
      const text = li.textContent
        .replace(date, '')
        .replace('📢', '')
        .trim();
      
      currentAnnouncements.push({ date, text });
    });
    
    // Save to localStorage
    localStorage.setItem('pravaah_announcements', JSON.stringify(currentAnnouncements));
  } else {
    // If announcements exist in localStorage, use them
    const parsedAnnouncements = JSON.parse(announcements);
    
    // Clear current announcements
    announcementList.innerHTML = '';
    
    // Add announcements from localStorage
    parsedAnnouncements.forEach(announcement => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="announcement-date">${announcement.date}</span> 📢 ${announcement.text}`;
      announcementList.appendChild(li);
    });
  }
}

function addAnnouncement() {
  const input = document.getElementById('newAnnouncement');
  const list = document.getElementById('announcementList');

  const text = input.value.trim();
  if (!text) return showNotification('Please enter an announcement.', 'error');

  const now = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateString = `${monthNames[now.getMonth()]} ${now.getDate()}`;
  
  const li = document.createElement('li');
  li.innerHTML = `<span class="announcement-date">${dateString}</span> 📢 ${text}`;
  
  list.prepend(li);
  input.value = '';
  
  updateAnnouncementsInLocalStorage(dateString, text);
  
  showNotification('Announcement published!', 'success');
}

function updateAnnouncementsInLocalStorage(date, text) {
  // Get current announcements
  let announcements = localStorage.getItem('pravaah_announcements');
  
  if (announcements) {
    announcements = JSON.parse(announcements);
  } else {
    announcements = [];
  }
  
  announcements.unshift({ date, text });
  
  if (announcements.length > 10) {
    announcements = announcements.slice(0, 10);
  }
  
  localStorage.setItem('pravaah_announcements', JSON.stringify(announcements));
}

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
