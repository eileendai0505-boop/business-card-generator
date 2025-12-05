// 全局变量
let cropper = null;
let currentAvatarUrl = null;

// DOM 元素
const elements = {
    // 表单输入
    avatar: document.getElementById('avatar'),
    avatarPreview: document.getElementById('avatarPreview'),
    name: document.getElementById('name'),
    title: document.getElementById('title'),
    company: document.getElementById('company'),
    website: document.getElementById('website'),
    phone: document.getElementById('phone'),
    email: document.getElementById('email'),
    address: document.getElementById('address'),
    cardStyle: document.getElementById('cardStyle'),

    // 名片预览 - Version 1
    businessCard: document.getElementById('businessCard'),
    cardAvatar: document.getElementById('cardAvatarV1'),
    cardName: document.getElementById('cardNameV1'),
    cardTitle: document.getElementById('cardTitleV1'),
    cardCompany: document.getElementById('cardCompanyV1'),
    cardPhone: document.getElementById('cardPhoneV1'),
    cardEmail: document.getElementById('cardEmailV1'),
    cardWebsite: document.getElementById('cardWebsiteV1'),
    cardAddress: document.getElementById('cardAddressV1'),

    // 名片预览 - Version 2
    businessCardV2: document.getElementById('businessCardV2'),
    cardAvatarV2: document.getElementById('cardAvatarV2'),
    cardNameV2: document.getElementById('cardNameV2'),
    cardTitleV2: document.getElementById('cardTitleV2'),
    cardPhoneV2: document.getElementById('cardPhoneV2'),
    cardEmailV2: document.getElementById('cardEmailV2'),
    cardWebsiteV2: document.getElementById('cardWebsiteV2'),
    cardAddressV2: document.getElementById('cardAddressV2'),

    // 名片预览 - Version 3
    businessCardV3: document.getElementById('businessCardV3'),
    cardAvatarV3: document.getElementById('cardAvatarV3'),
    cardNameV3: document.getElementById('cardNameV3'),
    cardTitleV3: document.getElementById('cardTitleV3'),
    cardCompanyV3: document.getElementById('cardCompanyV3'),
    cardPhoneV3: document.getElementById('cardPhoneV3'),
    cardEmailV3: document.getElementById('cardEmailV3'),
    cardWebsiteV3: document.getElementById('cardWebsiteV3'),
    cardAddressV3: document.getElementById('cardAddressV3'),

    // 模态框
    cropModal: document.getElementById('cropModal'),
    cropImage: document.getElementById('cropImage'),
    confirmCrop: document.getElementById('confirmCrop'),
    zoomSlider: document.getElementById('zoomSlider'),

    // 下载按钮
    downloadBtn: document.getElementById('downloadBtn')
};

// 当前选中的版本
let currentVersion = 'version1';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
});

// 初始化事件监听器
function initializeEventListeners() {
    // 头像上传
    elements.avatar.addEventListener('change', handleAvatarUpload);
    elements.confirmCrop.addEventListener('click', confirmCrop);
    elements.zoomSlider.addEventListener('input', handleZoom);

    // 实时更新预览
    elements.name.addEventListener('input', updatePreview);
    elements.title.addEventListener('input', updatePreview);
    elements.company.addEventListener('input', updatePreview);
    elements.website.addEventListener('input', updatePreview);
    elements.phone.addEventListener('input', updatePreview);
    elements.email.addEventListener('input', updatePreview);
    elements.address.addEventListener('input', updatePreview);

    // 风格选择器
    initializeStyleSelector();

    // 下载按钮
    elements.downloadBtn.addEventListener('click', downloadCard);
}

// 初始化风格选择器
function initializeStyleSelector() {
    const styleOptions = document.querySelectorAll('.style-option');

    styleOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            styleOptions.forEach(opt => opt.classList.remove('active'));

            // Add active class to clicked option
            option.classList.add('active');

            // Update card style
            const selectedStyle = option.dataset.style;
            switchCardStyle(selectedStyle);

            // Update hidden input value
            elements.cardStyle.value = selectedStyle;
        });
    });
}

// 切换名片风格
function switchCardStyle(style) {
    const version1Card = elements.businessCard;
    const version2Card = elements.businessCardV2;
    const version3Card = elements.businessCardV3;

    if (style === 'version1') {
        version1Card.style.display = 'block';
        version2Card.style.display = 'none';
        version3Card.style.display = 'none';
        currentVersion = 'version1';
    } else if (style === 'version2') {
        version1Card.style.display = 'none';
        version2Card.style.display = 'block';
        version3Card.style.display = 'none';
        currentVersion = 'version2';
    } else if (style === 'version3') {
        version1Card.style.display = 'none';
        version2Card.style.display = 'none';
        version3Card.style.display = 'block';
        currentVersion = 'version3';
    }

    // 更新预览
    updatePreview();
}

// Handle Avatar Upload
function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size cannot exceed 5MB');
        return;
    }

    // 读取文件
    const reader = new FileReader();
    reader.onload = function(e) {
        // 显示裁剪模态框
        elements.cropImage.src = e.target.result;
        elements.cropModal.style.display = 'block';

        // 等待图片加载完成后初始化裁剪器
        elements.cropImage.onload = function() {
            // 初始化裁剪器
            if (cropper) {
                cropper.destroy();
            }

            cropper = new Cropper(elements.cropImage, {
                aspectRatio: 1,
                viewMode: 1,
                dragMode: 'move',
                autoCropArea: 1,
                restore: false,
                guides: true,
                center: true,
                highlight: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,
            });

            // 重置 zoom slider
            elements.zoomSlider.value = 1;
        };
    };
    reader.readAsDataURL(file);
}

// Confirm Crop
function confirmCrop() {
    if (!cropper) return;

    // 获取裁剪后的画布
    const canvas = cropper.getCroppedCanvas({
        width: 255,
        height: 255,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
    });

    // 转换为URL
    currentAvatarUrl = canvas.toDataURL('image/jpeg', 0.9);

    // 更新预览
    updateAvatarPreview(currentAvatarUrl);

    // 关闭模态框
    closeCropModal();
}

// 关闭裁剪模态框
function closeCropModal() {
    elements.cropModal.style.display = 'none';
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
}

// Update Avatar Preview
function updateAvatarPreview(url) {
    // 更新左侧预览
    elements.avatarPreview.innerHTML = `<img src="${url}" alt="Avatar">`;

    // 更新所有版本的名片预览
    elements.cardAvatar.innerHTML = `<img src="${url}" alt="Avatar">`;
    elements.cardAvatarV2.innerHTML = `<img src="${url}" alt="Avatar">`;
    elements.cardAvatarV3.innerHTML = `<img src="${url}" alt="Avatar">`;
}

// Handle Zoom
function handleZoom(e) {
    if (cropper) {
        const zoomValue = parseFloat(e.target.value);
        cropper.zoomTo(zoomValue);
    }
}

// Real-time Update Preview
function updatePreview() {
    // 更新Version 1
    elements.cardName.textContent = elements.name.value || 'Your Name';
    elements.cardTitle.textContent = elements.title.value || 'Your Title';
    elements.cardCompany.textContent = elements.company.value || 'Company Name';

    // 更新Version 2
    elements.cardNameV2.textContent = elements.name.value ? elements.name.value.toUpperCase() : 'YOUR NAME';
    elements.cardTitleV2.textContent = elements.title.value || 'Your Title';

    // 更新Version 3
    elements.cardNameV3.textContent = elements.name.value || 'Full Name';
    elements.cardTitleV3.textContent = elements.title.value || 'Job Title';
    elements.cardCompanyV3.textContent = elements.company.value || 'Company';

    // 更新联系方式
    updateContactItemV1(elements.cardPhone, elements.phone.value);
    updateContactItemV1(elements.cardEmail, elements.email.value);
    updateContactItemV1(elements.cardWebsite, elements.website.value);
    updateContactItemV1(elements.cardAddress, elements.address.value);

    updateContactItemV2(elements.cardPhoneV2, elements.phone.value, 'PHONE');
    updateContactItemV2(elements.cardEmailV2, elements.email.value, 'EMAIL');
    updateContactItemV2(elements.cardWebsiteV2, elements.website.value, 'WEBSITE');
    updateContactItemV2(elements.cardAddressV2, elements.address.value, 'ADDRESS');

    updateContactItemV3(elements.cardPhoneV3, elements.phone.value);
    updateContactItemV3(elements.cardEmailV3, elements.email.value);
    updateContactItemV3(elements.cardWebsiteV3, elements.website.value);
    updateContactItemV3(elements.cardAddressV3, elements.address.value);
}

// Update Contact Item - Version 1
function updateContactItemV1(element, value) {
    if (element.id === 'cardAddressV1') {
        // Address special handling
        if (value) {
            element.style.display = 'flex';
            const addressText = element.querySelector('.address-text');
            if (addressText) {
                addressText.textContent = value;
                // Ensure proper display styles for address text
                addressText.style.display = 'block';
                addressText.style.visibility = 'visible';
                addressText.style.opacity = '1';
            }
        } else {
            element.style.display = 'none';
        }
    } else {
        // Other contact methods
        if (value) {
            element.style.display = 'flex';
            const span = element.querySelector('span');
            if (span) {
                span.textContent = value;
            }
        } else {
            element.style.display = 'none';
        }
    }
}

// Update Contact Item - Version 2
function updateContactItemV2(element, value, defaultLabel) {
    // All contact items including address follow the same pattern in Version 2
    if (value) {
        element.style.display = 'flex';
        const span = element.querySelector('span');
        if (span) {
            span.textContent = value;
            // Ensure address spans properly handle multi-line content
            if (element.id === 'cardAddressV2') {
                span.style.whiteSpace = 'normal';
                span.style.wordBreak = 'break-word';
                span.style.lineHeight = '1.3';
            }
        }
    } else {
        element.style.display = 'flex';
        const span = element.querySelector('span');
        if (span) {
            span.textContent = defaultLabel;
        }
    }
}

// Update Contact Item - Version 3
function updateContactItemV3(element, value) {
    if (value) {
        element.style.display = 'flex';
        const textSpan = element.querySelector('.contact-text');
        if (textSpan) {
            textSpan.textContent = value;
            // Ensure proper text wrapping for address
            if (element.id === 'cardAddressV3') {
                textSpan.style.whiteSpace = 'normal';
                textSpan.style.wordWrap = 'break-word';
                textSpan.style.wordBreak = 'break-word';
            }
        }
    } else {
        element.style.display = 'none';
    }
}

// Download Business Card
async function downloadCard() {
    try {
        // 显示加载状态
        elements.downloadBtn.disabled = true;
        elements.downloadBtn.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Generating...';

        // 获取当前显示的名片版本
        const activeCard = currentVersion === 'version1' ? elements.businessCard :
                          currentVersion === 'version2' ? elements.businessCardV2 :
                          elements.businessCardV3;

        // Force a final update to ensure all content is rendered
        updatePreview();

        // Brief delay to ensure DOM updates are rendered
        await new Promise(resolve => setTimeout(resolve, 100));

        // Ensure all address elements are visible for html2canvas
        if (currentVersion === 'version1') {
            const addressElement = document.getElementById('cardAddressV1');
            if (addressElement && elements.address.value) {
                addressElement.style.display = 'flex';
                const addressText = addressElement.querySelector('.address-text');
                if (addressText) {
                    addressText.style.visibility = 'visible';
                    addressText.style.opacity = '1';
                }
            }
        } else if (currentVersion === 'version2') {
            const addressElement = document.getElementById('cardAddressV2');
            if (addressElement) {
                addressElement.style.display = 'flex';
                const addressSpan = addressElement.querySelector('span');
                if (addressSpan) {
                    addressSpan.style.visibility = 'visible';
                    addressSpan.style.opacity = '1';
                }
            }
        } else if (currentVersion === 'version3') {
            const addressElement = document.getElementById('cardAddressV3');
            if (addressElement && elements.address.value) {
                addressElement.style.display = 'flex';
                const addressSpan = addressElement.querySelector('.contact-text');
                if (addressSpan) {
                    addressSpan.style.visibility = 'visible';
                    addressSpan.style.opacity = '1';
                }
            }
        }

        // 使用 html2canvas 生成图片
        const canvas = await html2canvas(activeCard, {
            scale: 2, // 提高分辨率
            backgroundColor: null,
            logging: false,
            useCORS: true,
            allowTaint: true,
            height: activeCard.scrollHeight, // Use full scroll height
            windowHeight: activeCard.scrollHeight,
            onclone: function(clonedDoc) {
                // Ensure styles are applied in the cloned document
                const clonedCard = clonedDoc.querySelector(activeCard.tagName === 'DIV' ?
                    `#${activeCard.id}` : '.business-card');
                if (clonedCard) {
                    // Force display of address elements
                    const addressId = currentVersion === 'version1' ? '#cardAddressV1' :
                                    currentVersion === 'version2' ? '#cardAddressV2' :
                                    '#cardAddressV3';
                    const addressElement = clonedCard.querySelector(addressId);
                    if (addressElement) {
                        addressElement.style.display = 'flex';
                        addressElement.style.visibility = 'visible';
                        addressElement.style.opacity = '1';
                    }

                    // Remove height constraints in cloned card
                    clonedCard.style.height = 'auto';
                    clonedCard.style.overflow = 'visible';

                    // Ensure address text elements are fully visible
                    const allAddressElements = clonedCard.querySelectorAll('[id*="cardAddress"]');
                    allAddressElements.forEach(el => {
                        el.style.display = 'flex';
                        el.style.visibility = 'visible';
                        el.style.opacity = '1';
                        el.style.height = 'auto';
                        el.style.overflow = 'visible';

                        // Handle different address text containers based on version
                        let textContainer;
                        if (currentVersion === 'version3') {
                            textContainer = el.querySelector('.contact-text, .address-text');
                        } else {
                            textContainer = el.querySelector('span, .address-text');
                        }

                        if (textContainer) {
                            textContainer.style.display = 'block';
                            textContainer.style.visibility = 'visible';
                            textContainer.style.opacity = '1';
                            textContainer.style.whiteSpace = 'normal';
                            textContainer.style.wordWrap = 'break-word';
                            textContainer.style.wordBreak = 'break-word';
                            textContainer.style.height = 'auto';
                            textContainer.style.overflow = 'visible';
                        }
                    });
                }
            }
        });

        // 转换为 blob
        canvas.toBlob((blob) => {
            // 创建下载链接
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `BusinessCard_${elements.name.value || 'unnamed'}_${new Date().getTime()}.jpg`;
            link.href = url;

            // 触发下载
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // 清理
            URL.revokeObjectURL(url);

            // 恢复按钮状态
            elements.downloadBtn.disabled = false;
            elements.downloadBtn.innerHTML = '<i class="ri-download-line"></i> Download Card (JPG)';

            // 显示成功提示
            showNotification('Business card downloaded successfully!');
        }, 'image/jpeg', 0.95);

    } catch (error) {
        console.error('Failed to generate business card:', error);
        // 恢复按钮状态
        elements.downloadBtn.disabled = false;
        elements.downloadBtn.innerHTML = '<i class="ri-download-line"></i> Download Card (JPG)';

        // 显示错误提示
        showNotification('Failed to generate card, please try again', 'error');
    }
}

// Show Notification
function showNotification(message, type = 'success') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="ri-${type === 'success' ? 'check' : 'error-warning'}-line"></i>
        <span>${message}</span>
    `;

    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : '#f56565'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;

    // 添加动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        .animate-spin {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // 添加到页面
    document.body.appendChild(notification);

    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Click outside modal to close
window.onclick = function(event) {
    if (event.target === elements.cropModal) {
        closeCropModal();
    }
}

// Prevent data loss on page refresh
window.addEventListener('beforeunload', (e) => {
    // Check for unsaved data
    const hasData = elements.name.value || elements.title.value || elements.company.value ||
                   elements.phone.value || elements.email.value || currentAvatarUrl;

    if (hasData) {
        e.preventDefault();
        e.returnValue = '';
    }
});