import type { AppLanguage } from '../types/domain';

export interface TranslationDictionary {
  nav: {
    home: string;
    lobby: string;
    rooms: string;
    avatar: string;
    profile: string;
    settings: string;
    menu: string;
    closeMenu: string;
  };
  landing: {
    eyebrow: string;
    headline: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    pillarsTitle: string;
    pillarsSubtitle: string;
    pillars: Array<{ index: string; title: string; body: string }>;
    sanctuaryTitle: string;
    sanctuaryBody: string;
    sanctuaryNote: string;
    enterLobbyCta: string;
  };
  lobby: {
    title: string;
    subtitle: string;
    welcomePrefix: string;
    guestBadge: string;
    createRoom: string;
    exploreAllRooms: string;
    quickProfile: string;
    quickAvatar: string;
    featuredTitle: string;
    demoDataNotice: string;
  };
  rooms: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterAll: string;
    filterPublic: string;
    filterPrivate: string;
    sortFeatured: string;
    sortOccupancy: string;
    sortName: string;
    refresh: string;
    createRoom: string;
    joinRoom: string;
    fullRoom: string;
    emptyTitle: string;
    emptyBody: string;
    resetFilters: string;
    publicLabel: string;
    privateLabel: string;
    seatsUnit: string;
    demoSuffix: string;
  };
  profile: {
    title: string;
    subtitle: string;
    editProfile: string;
    saveProfile: string;
    cancel: string;
    displayName: string;
    bio: string;
    favoriteTea: string;
    accountStatusTitle: string;
    guestStatusValue: string;
    authSectionTitle: string;
    authSectionNote: string;
    googleProvider: string;
    facebookProvider: string;
    avatarCta: string;
    settingsCta: string;
  };
  avatar: {
    title: string;
    subtitle: string;
    phaseNoticeTitle: string;
    phaseNoticeBody: string;
    attireLabel: string;
    toneLabel: string;
    hairLabel: string;
    postureLabel: string;
    saveDraft: string;
    openReadinessModal: string;
    studioLabel: string;
    previewTitle: string;
    demoModelNotice: string;
    modelReady: string;
    assetError: string;
    appearanceTitle: string;
    presentationLabel: string;
    faceLabel: string;
    hairColorLabel: string;
    clothingColorLabel: string;
    accessoriesLabel: string;
    heightLabel: string;
    viewFull: string;
    viewPortrait: string;
    reset: string;
    saved: string;
    unsaved: string;
    animationsTitle: string;
    noAnimationNotice: string;
    animationIdle: string;
    animationWalk: string;
    animationMeditate: string;
    animationTea: string;
    modelPipelineTitle: string;
    modelPipelineBody: string;
  };
  settings: {
    title: string;
    subtitle: string;
    graphicsTitle: string;
    graphicsDesc: string;
    soundTitle: string;
    languageTitle: string;
    interfaceTitle: string;
    privacyTitle: string;
    resetDemoTitle: string;
    resetDemoButton: string;
  };
  common: {
    loading: string;
    errorTitle: string;
    retry: string;
    backHome: string;
    backLobby: string;
    close: string;
    confirm: string;
    cancel: string;
  };
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDictionary> = {
  vi: {
    nav: {
      home: 'Trang chủ',
      lobby: 'Sảnh Trà',
      rooms: 'Phòng Trà',
      avatar: 'Nhân Vật',
      profile: 'Hồ Sơ',
      settings: 'Cài Đặt',
      menu: 'Mở danh mục điều hướng',
      closeMenu: 'Đóng danh mục điều hướng',
    },
    landing: {
      eyebrow: 'Không Gian Trà Thất Số · Kiến Trúc Á Đông',
      headline: 'Sự Tĩnh Lặng Trong Từng Khoảnh Khắc Thưởng Trà',
      subtitle:
        'ZEN TEA HOUSE là trà thất trực tuyến kết hợp khoảng 70% tinh thần tối giản Thiền Nhật và 30% phong thái trà thư phòng văn nhân Trung Hoa — nơi con người gặp gỡ, pha trà và chia sẻ sự hiện diện điềm tĩnh.',
      primaryCta: 'Bước vào Trà Thất',
      secondaryCta: 'Khám phá Trải Nghiệm',
      pillarsTitle: 'Bốn Trụ Cột Của Không Gian Tĩnh Tại',
      pillarsSubtitle:
        'Thiết kế như một kiến trúc gỗ và sương núi, không điểm số, không cạnh tranh, chỉ còn sự hiện diện và hương trà.',
      pillars: [
        {
          index: '01',
          title: 'Kiến Trúc Tự Nhiên & Chiều Sâu Không Gian',
          body: 'Gỗ tuyết tùng, chiếu tatami, vách giấy shoji và sương núi hòa quyện cùng ánh sáng tự nhiên dịu nhẹ qua góc nhìn thứ ba mượt mà.',
        },
        {
          index: '02',
          title: 'Nhân Vật Tự Nhiên & Cử Chỉ Khoan Thai',
          body: 'Tạo hình nhân vật người với tỷ lệ tự nhiên, trang phục vải lanh, Hanfu và Yukata trang nhã cùng ngôn ngữ cơ thể điềm tĩnh.',
        },
        {
          index: '03',
          title: 'Phòng Trà Gắn Kết 8–12 Hành Giả',
          body: 'Mỗi phòng giới hạn tối đa 12 vị trí ngồi quanh bàn trà, đảm bảo sự ấm cúng, lắng nghe và đồng điệu giữa những người tham dự.',
        },
        {
          index: '04',
          title: 'Nghi Thức Pha Trà & Chia Sẻ Chánh Niệm',
          body: 'Từng thao tác chọn trà, tráng ấm, rót trà, mời bạn đồng trà và nâng chén đều mang nhịp điệu chậm rãi và trọn vẹn.',
        },
      ],
      sanctuaryTitle: 'Lộ Trình Kiến Tạo Có Kỷ Luật',
      sanctuaryBody:
        'Phiên bản hiện tại thuộc Giai đoạn 01 (Nền tảng Ứng dụng & Hệ thống Giao diện). Mọi dữ liệu phòng và hồ sơ đang vận hành ở Chế độ Khách Trải Nghiệm (Demo) tách biệt, sẵn sàng kết nối thế giới 3D Three.js, xác thực Firebase và đồng bộ thời gian thực ở các giai đoạn kế tiếp.',
      sanctuaryNote: 'Hiện tại: Nền tảng giao diện & Dữ liệu Demo · Thế giới 3D & Multiplayer đang chuẩn bị cho Giai đoạn 02–05.',
      enterLobbyCta: 'Vào Sảnh Trà Demo',
    },
    lobby: {
      title: 'Sảnh Trà Thất',
      subtitle: 'Chọn một không gian trà thất để chuẩn bị bước vào, hoặc khởi tạo phòng trà thử nghiệm mới.',
      welcomePrefix: 'Kính chào,',
      guestBadge: 'Chế độ Khách Trải Nghiệm (Demo cục bộ)',
      createRoom: 'Tạo Phòng Trà Mới',
      exploreAllRooms: 'Xem tất cả phòng trà',
      quickProfile: 'Hồ sơ cá nhân',
      quickAvatar: 'Chuẩn bị nhân vật',
      featuredTitle: 'Không Gian Trà Thất Hiện Có',
      demoDataNotice:
        'Lưu ý minh bạch: Danh sách dưới đây là dữ liệu mẫu (Demo) phục vụ kiểm tra trải nghiệm luồng ứng dụng ở Giai đoạn 01. Chưa có kết nối máy chủ nhiều người chơi thực.',
    },
    rooms: {
      title: 'Khám Phá Phòng Trà',
      subtitle: 'Tìm kiếm theo tên không gian, truyền thống trà hoặc lọc theo quyền riêng tư (tối đa 12 người/phòng).',
      searchPlaceholder: 'Tìm phòng trà hoặc loại trà...',
      filterAll: 'Tất cả',
      filterPublic: 'Công khai',
      filterPrivate: 'Riêng tư',
      sortFeatured: 'Mặc định',
      sortOccupancy: 'Còn nhiều chỗ',
      sortName: 'Theo tên A–Z',
      refresh: 'Làm mới danh sách',
      createRoom: 'Khởi tạo phòng',
      joinRoom: 'Vào không gian',
      fullRoom: 'Đã đủ chỗ',
      emptyTitle: 'Không tìm thấy phòng trà phù hợp',
      emptyBody: 'Thử thay đổi từ khóa tìm kiếm hoặc đặt lại bộ lọc để xem toàn bộ trà thất hiện có.',
      resetFilters: 'Đặt lại bộ lọc',
      publicLabel: 'Công khai',
      privateLabel: 'Riêng tư',
      seatsUnit: 'chỗ',
      demoSuffix: 'Dữ liệu mẫu',
    },
    profile: {
      title: 'Hồ Sơ Cá Nhân',
      subtitle: 'Quản lý danh tính hiển thị, trà yêu thích và tình trạng liên kết tài khoản.',
      editProfile: 'Chỉnh sửa hồ sơ',
      saveProfile: 'Lưu thay đổi',
      cancel: 'Hủy bỏ',
      displayName: 'Tên hiển thị',
      bio: 'Giới thiệu ngắn',
      favoriteTea: 'Dòng trà yêu thích',
      accountStatusTitle: 'Tình trạng tài khoản',
      guestStatusValue: 'Khách Trải Nghiệm (Lưu cục bộ trên trình duyệt — Chưa xác thực)',
      authSectionTitle: 'Liên kết Tài khoản (Sẵn sàng cho Giai đoạn 04)',
      authSectionNote:
        'Xác thực thực tế qua Google và Facebook bằng Firebase Authentication sẽ được kích hoạt ở Giai đoạn 04. Chế độ Khách Demo luôn tách biệt với tài khoản thật.',
      googleProvider: 'Đăng nhập bằng Google (Giai đoạn 04)',
      facebookProvider: 'Đăng nhập bằng Facebook (Giai đoạn 04)',
      avatarCta: 'Tới Cổng Tạo Hình Nhân Vật',
      settingsCta: 'Tùy chỉnh Cài Đặt',
    },
    avatar: {
      title: 'Studio Tạo Hình Nhân Vật',
      subtitle: 'Tùy chỉnh diện mạo và trang phục trong không gian xem trước 3D; mô hình demo hiện chưa có nhân vật GLB rigged.',
      phaseNoticeTitle: 'Studio Nhân Vật · Giai đoạn 03',
      phaseNoticeBody: 'Bản xem trước dựng bằng hình khối để thử cấu hình. Chưa có nhân vật 3D tả thực, skeleton rig hoặc hoạt ảnh bên ngoài được cung cấp.',
      attireLabel: 'Phong cách trang phục',
      toneLabel: 'Bảng màu vải tự nhiên',
      hairLabel: 'Kiểu tóc dự kiến',
      postureLabel: 'Tư thế & Khí chất',
      saveDraft: 'Lưu phác thảo cấu hình',
      openReadinessModal: 'Xem lộ trình Studio 3D',
      studioLabel: 'PHASE 03 · AVATAR STUDIO',
      previewTitle: 'Bản xem trước 3D',
      demoModelNotice: 'Mô hình minh họa dựng thủ công · Chưa có nhân vật GLB rigged hoặc hoạt ảnh được kết nối.',
      modelReady: 'Đã nạp mô hình GLB',
      assetError: 'Không thể nạp mô hình GLB đã cấu hình. Đang dùng mô hình demo.',
      appearanceTitle: 'Diện mạo',
      presentationLabel: 'Phong thái',
      faceLabel: 'Khuôn mặt',
      hairColorLabel: 'Màu tóc',
      clothingColorLabel: 'Màu trang phục',
      accessoriesLabel: 'Phụ kiện',
      heightLabel: 'Chiều cao',
      viewFull: 'Toàn thân',
      viewPortrait: 'Chân dung',
      reset: 'Đặt lại',
      saved: 'Đã lưu trên thiết bị này',
      unsaved: 'Có thay đổi chưa lưu',
      animationsTitle: 'Thử chuyển động',
      noAnimationNotice: 'Hoạt ảnh chỉ khả dụng khi mô hình GLB có sẵn clip tương ứng.',
      animationIdle: 'Tĩnh tại',
      animationWalk: 'Đi chậm',
      animationMeditate: 'Ngồi thiền',
      animationTea: 'Nâng chén trà',
      modelPipelineTitle: 'Quy trình mô hình nhân vật',
      modelPipelineBody: 'Đặt tệp GLB/GLTF có rig vào public/assets/avatars/ và cấu hình VITE_AVATAR_GLB_URL. Studio sẽ kiểm tra skeleton và clip hoạt ảnh trước khi dùng.',
    },
    settings: {
      title: 'Cài Đặt Hệ Thống',
      subtitle: 'Điều chỉnh chất lượng hiển thị 3D dự kiến, âm thanh, ngôn ngữ và tùy chọn riêng tư.',
      graphicsTitle: 'Chất lượng Đồ họa',
      graphicsDesc: 'Chuẩn bị cấu hình cho công cụ dựng hình Three.js ở Giai đoạn 02 trên máy tính, máy tính bảng và điện thoại.',
      soundTitle: 'Âm thanh & Không gian',
      languageTitle: 'Ngôn ngữ Giao diện',
      interfaceTitle: 'Hiển thị & Chuyển động',
      privacyTitle: 'Quyền riêng tư & Dữ liệu Demo',
      resetDemoTitle: 'Khôi phục dữ liệu mẫu',
      resetDemoButton: 'Đặt lại dữ liệu Demo',
    },
    common: {
      loading: 'Đang chuẩn bị không gian...',
      errorTitle: 'Không thể hoàn tất thao tác',
      retry: 'Thử lại',
      backHome: 'Về Trang chủ',
      backLobby: 'Quay lại Sảnh Trà',
      close: 'Đóng',
      confirm: 'Xác nhận',
      cancel: 'Hủy',
    },
  },
  en: {
    nav: {
      home: 'Home',
      lobby: 'Lobby',
      rooms: 'Tea Rooms',
      avatar: 'Character',
      profile: 'Profile',
      settings: 'Settings',
      menu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
    },
    landing: {
      eyebrow: 'Digital Sanctuary · Asian Tea Architecture',
      headline: 'Stillness Within Every Shared Cup of Tea',
      subtitle:
        'ZEN TEA HOUSE is a virtual Asian tea sanctuary blending 70% Japanese Zen minimalism with 30% traditional Chinese literati tea culture — built for calm presence and mindful conversation.',
      primaryCta: 'Enter the Tea House',
      secondaryCta: 'Explore the Experience',
      pillarsTitle: 'Four Pillars of the Sanctuary',
      pillarsSubtitle:
        'Designed as timber, stone, and mountain mist — no scores, no competition, only stillness and tea.',
      pillars: [
        {
          index: '01',
          title: 'Natural Architecture & Atmospheric Depth',
          body: 'Cedar beams, tatami mats, shoji screens, and misty mountains lit by soft daylight through a smooth third-person camera.',
        },
        {
          index: '02',
          title: 'Natural Human Avatars & Calm Posture',
          body: 'Human proportions with natural fabrics — Hanfu robes, Zen yukata, and minimalist linen with unhurried body language.',
        },
        {
          index: '03',
          title: 'Intimate Rooms of 8–12 Guests',
          body: 'Each tea pavilion is strictly capped at 12 seats around the table to preserve quiet intimacy and attentive conversation.',
        },
        {
          index: '04',
          title: 'Mindful Tea Preparation & Sharing',
          body: 'Selecting leaves, warming vessels, pouring tea, inviting companions, and lifting the cup together at an unhurried pace.',
        },
      ],
      sanctuaryTitle: 'Disciplined Phased Architecture',
      sanctuaryBody:
        'This release represents Phase 01 (Application Foundation & Core UI System). Rooms and profiles run in an isolated Guest Demo layer, ready for Three.js 3D world integration, Firebase auth, and multiplayer synchronization in upcoming phases.',
      sanctuaryNote: 'Current Stage: UI Foundation & Demo Layer · 3D World & Multiplayer scheduled for Phases 02–05.',
      enterLobbyCta: 'Open Demo Lobby',
    },
    lobby: {
      title: 'Tea House Lobby',
      subtitle: 'Choose a tea pavilion to preview, or create a new demo tea room.',
      welcomePrefix: 'Welcome,',
      guestBadge: 'Guest Demo Mode (Local browser state)',
      createRoom: 'Create Tea Room',
      exploreAllRooms: 'View all tea rooms',
      quickProfile: 'Personal profile',
      quickAvatar: 'Prepare character',
      featuredTitle: 'Available Tea Pavilions',
      demoDataNotice:
        'Transparency note: Rooms shown here use isolated Phase 01 demo data to verify navigation and state architecture. Live multiplayer is not yet connected.',
    },
    rooms: {
      title: 'Tea Room Discovery',
      subtitle: 'Search by pavilion name or tea tradition, and filter by visibility (max 12 guests per room).',
      searchPlaceholder: 'Search tea room or tea type...',
      filterAll: 'All',
      filterPublic: 'Public',
      filterPrivate: 'Private',
      sortFeatured: 'Featured',
      sortOccupancy: 'Most open seats',
      sortName: 'Name A–Z',
      refresh: 'Refresh list',
      createRoom: 'Create room',
      joinRoom: 'Enter space',
      fullRoom: 'Room full',
      emptyTitle: 'No matching tea rooms found',
      emptyBody: 'Adjust your search query or reset filters to view all available tea pavilions.',
      resetFilters: 'Reset filters',
      publicLabel: 'Public',
      privateLabel: 'Private',
      seatsUnit: 'seats',
      demoSuffix: 'Demo data',
    },
    profile: {
      title: 'User Profile',
      subtitle: 'Manage your display name, preferred tea, and account connection status.',
      editProfile: 'Edit profile',
      saveProfile: 'Save changes',
      cancel: 'Cancel',
      displayName: 'Display name',
      bio: 'Short introduction',
      favoriteTea: 'Preferred tea',
      accountStatusTitle: 'Account Status',
      guestStatusValue: 'Guest Demo Mode (Stored locally — Not authenticated)',
      authSectionTitle: 'Account Providers (Prepared for Phase 04)',
      authSectionNote:
        'Real Google and Facebook sign-in via Firebase Authentication will be enabled in Phase 04. Guest Demo sessions remain strictly separated from real accounts.',
      googleProvider: 'Continue with Google (Phase 04)',
      facebookProvider: 'Continue with Facebook (Phase 04)',
      avatarCta: 'Open Character Entry',
      settingsCta: 'Application Settings',
    },
    avatar: {
      title: 'Avatar Studio',
      subtitle: 'Customize appearance and tea-house attire in an interactive 3D preview. The current demo figure is not rigged.',
      phaseNoticeTitle: 'Character Studio · Phase 03',
      phaseNoticeBody:
        'The preview uses procedural geometry for configuration testing. No photorealistic character, skeleton rig, or external animation asset has been supplied.',
      attireLabel: 'Attire style',
      toneLabel: 'Natural fabric palette',
      hairLabel: 'Planned hairstyle',
      postureLabel: 'Posture & presence',
      saveDraft: 'Save draft configuration',
      openReadinessModal: 'View 3D Studio roadmap',
      studioLabel: 'PHASE 03 · AVATAR STUDIO',
      previewTitle: '3D preview',
      demoModelNotice: 'Procedural demonstration model · No rigged character GLB or animation clips are connected.',
      modelReady: 'GLB model loaded',
      assetError: 'The configured GLB could not be loaded. Showing the demo model.',
      appearanceTitle: 'Appearance',
      presentationLabel: 'Presentation',
      faceLabel: 'Face shape',
      hairColorLabel: 'Hair color',
      clothingColorLabel: 'Clothing color',
      accessoriesLabel: 'Accessories',
      heightLabel: 'Height',
      viewFull: 'Full body',
      viewPortrait: 'Portrait',
      reset: 'Reset',
      saved: 'Saved on this device',
      unsaved: 'Unsaved changes',
      animationsTitle: 'Preview movement',
      noAnimationNotice: 'Animations are available only when the loaded GLB contains the matching clip.',
      animationIdle: 'Idle',
      animationWalk: 'Walk',
      animationMeditate: 'Seated meditation',
      animationTea: 'Raise tea cup',
      modelPipelineTitle: 'Character asset pipeline',
      modelPipelineBody: 'Place a rigged GLB/GLTF in public/assets/avatars/ and set VITE_AVATAR_GLB_URL. The Studio validates its skeleton and animation clips before use.',
    },
    settings: {
      title: 'Application Settings',
      subtitle: 'Configure graphics presets, ambient sound, language, and privacy preferences.',
      graphicsTitle: 'Graphics Quality',
      graphicsDesc: 'Pre-configures rendering budgets for the Phase 02 Three.js scene across desktop, tablet, and mobile.',
      soundTitle: 'Sound & Atmosphere',
      languageTitle: 'Interface Language',
      interfaceTitle: 'Appearance & Motion',
      privacyTitle: 'Privacy & Demo Data',
      resetDemoTitle: 'Restore demo defaults',
      resetDemoButton: 'Reset Demo Data',
    },
    common: {
      loading: 'Preparing the space...',
      errorTitle: 'Unable to complete action',
      retry: 'Try again',
      backHome: 'Back to Home',
      backLobby: 'Back to Lobby',
      close: 'Close',
      confirm: 'Confirm',
      cancel: 'Cancel',
    },
  },
};
