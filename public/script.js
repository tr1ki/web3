// API base URL
const API_URL = '/api/blogs';

// DOM elements
const blogForm = document.getElementById('blogForm');
const postsContainer = document.getElementById('postsContainer');

// Load all blog posts when page loads
document.addEventListener('DOMContentLoaded', loadPosts);

// Handle form submission
blogForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(blogForm);
    const blogData = {
        title: formData.get('title'),
        body: formData.get('body'),
        author: formData.get('author') || 'Anonymous'
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(blogData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Post created successfully!', 'success');
            blogForm.reset();
            loadPosts(); // Refresh the posts list
        } else {
            showMessage(result.error || 'Failed to create post', 'error');
        }
    } catch (error) {
        showMessage('Network error: ' + error.message, 'error');
    }
});

// Load all blog posts
async function loadPosts() {
    try {
        postsContainer.innerHTML = '<p class="loading">Loading posts...</p>';
        
        const response = await fetch(API_URL);
        const posts = await response.json();
        
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="no-posts">No blog posts yet. Create your first post!</p>';
            return;
        }
        
        displayPosts(posts);
    } catch (error) {
        postsContainer.innerHTML = `<p class="error">Failed to load posts: ${error.message}</p>`;
    }
}

// Display blog posts
function displayPosts(posts) {
    postsContainer.innerHTML = posts.map(post => `
        <div class="post-card">
            <h3>${escapeHtml(post.title)}</h3>
            <div class="post-meta">
                By ${escapeHtml(post.author)} • ${formatDate(post.createdAt)}
            </div>
            <div class="post-content">
                ${escapeHtml(post.body)}
            </div>
            <button class="delete-btn" onclick="deletePost('${post._id}')">Delete Post</button>
        </div>
    `).join('');
}

// Delete a blog post
async function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Post deleted successfully!', 'success');
            loadPosts(); // Refresh the posts list
        } else {
            showMessage(result.error || 'Failed to delete post', 'error');
        }
    } catch (error) {
        showMessage('Network error: ' + error.message, 'error');
    }
}

// Show message to user
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.success, .error');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageEl = document.createElement('div');
    messageEl.className = type;
    messageEl.textContent = message;
    
    // Insert at the top of container
    document.querySelector('.container').insertBefore(messageEl, document.querySelector('.form-section'));
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}