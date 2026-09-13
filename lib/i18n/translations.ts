export type Language = 'en' | 'km' | 'zh'

export interface TranslationDictionary {
  nav: {
    home: string
    services: string
    gallery: string
    videos: string
    about: string
    contact: string
  }
  mobileNavTags: {
    home: string
    services: string
    gallery: string
    videos: string
    about: string
    contact: string
  }
  hero: {
    availableBadge: string
    location: string
    craftDev: string
    craftPhoto: string
    subtitle: string
    ctaSystems: string
    ctaVisual: string
    ctaContact: string
    telemetryEng: string
    telemetryEngItems: string
    telemetryStatus: string
    scrollExplore: string
  }
  services: {
    badge: string
    title: string
    subtitle: string
    interactiveTag: string
    liveDemoBtn: string
    liveSystemBadge: string
    previewBtn: string
    availableForBuild: string
    inquireBtn: string
    openNewWindow: string
    loadingPreview: string
    clickToExpand: string
    cards: {
      posTitle: string
      posDesc: string
      posTags: string[]
      topupTitle: string
      topupDesc: string
      topupTags: string[]
      webTitle: string
      webDesc: string
      webTags: string[]
      mobileTitle: string
      mobileDesc: string
      mobileTags: string[]
    }
  }
  portfolio: {
    badge: string
    title: string
    subtitle: string
    exploreBtn: string
    skills: {
      portraitTitle: string
      portraitBadge: string
      portraitDesc: string
      eventTitle: string
      eventBadge: string
      eventDesc: string
      cinemaTitle: string
      cinemaBadge: string
      cinemaDesc: string
      colorTitle: string
      colorBadge: string
      colorDesc: string
    }
    telemetry: {
      bodyLabel: string
      bodyValue: string
      lensLabel: string
      lensValue: string
      workflowLabel: string
      workflowValue: string
    }
    companionBook: {
      tag: string
      title: string
      desc: string
      btn: string
    }
    companionArchive: {
      tag: string
      title: string
      desc: string
      btn: string
    }
    photosCount: string
    albumsCount: string
  }
  galleryPage: {
    badge: string
    title: string
    subtitleTemplate: string
    searchPlaceholder: string
    filterAll: string
    filterFeatured: string
    filterWithSubAlbums: string
    photosLabel: string
    albumsLabel: string
    albumFallback: string
    emptyTitle: string
    emptyNoMatch: string
    emptyNoCreated: string
    resetFilters: string
    backToGallery: string
    backToCollection: string
  }
  videosPage: {
    badge: string
    title: string
    subtitle: string
    searchPlaceholder: string
    viewGrid: string
    viewCinematic: string
    allCategory: string
    emptyTitle: string
    emptyNoMatch: string
    emptyNoCreated: string
    resetFilters: string
  }
  aboutPage: {
    badge: string
    title: string
    name: string
    tagline: string
    bio: string
    yearsLabel: string
    setsLabel: string
    craftLabel: string
    initiateProject: string
    viewWorks: string
    location: string
    travels: string
    portraitLabel: string
    disciplinesTag: string
    disciplinesTitle: string
    disciplinesSub: string
    trajectoryTag: string
    trajectoryTitle: string
    accoladesTag: string
    accoladesTitle: string
    equipmentTag: string
    equipmentTitle: string
    equipmentSub: string
    calloutTitle: string
    calloutSub: string
    getInTouch: string
    exploreFilms: string
  }
  contactPage: {
    title: string
    subtitle: string
    emailLabel: string
    phoneLabel: string
    locationLabel: string
    websiteLabel: string
    copiedToast: string
    emptyTitle: string
    emptyDesc: string
    returnHome: string
  }
  videosSection: {
    badge: string
    title: string
    subtitle: string
    exploreBtn: string
  }
  cta: {
    headline: string
    sub: string
    contactBtn: string
    demosBtn: string
  }
  header: {
    brandName: string
    role: string
    menuLabel: string
    startProject: string
  }
  common: {
    langEn: string
    langKm: string
    langZh: string
  }
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    nav: {
      home: 'Home',
      services: 'Developer (Coding)',
      gallery: 'Gallery',
      videos: 'Videos',
      about: 'About',
      contact: 'Contact',
    },
    mobileNavTags: {
      home: 'Main Gateway',
      services: 'Full-Stack & Coding',
      gallery: 'Curated Photography',
      videos: 'Cinematic Motion',
      about: 'Developer Profile',
      contact: 'Start a Project',
    },
    hero: {
      availableBadge: 'AVAILABLE FOR BESPOKE SYSTEMS & CINEMA',
      location: 'PHNOM PENH, CAMBODIA',
      craftDev: 'Full-Stack Software Architecture',
      craftPhoto: 'Cinematic Film & Photography',
      subtitle: 'Software Developer & Cameraman • POS, Systems, Web & Mobile Apps • Cinematic Photography & Video Production',
      ctaSystems: 'Developer (Coding)',
      ctaVisual: 'Visual Stories',
      ctaContact: 'Get In Touch',
      telemetryEng: 'ENGINEERING & MOTION:',
      telemetryEngItems: 'POS • WEB • MOBILE • 4K CINEMA',
      telemetryStatus: 'PRODUCTION & FIELD READY',
      scrollExplore: 'SCROLL TO EXPLORE',
    },
    services: {
      badge: 'MY SKILL • DEVELOPER (CODING)',
      title: 'Developer (Coding)',
      subtitle: 'Production-grade enterprise software, web & mobile applications, POS architectures, and bespoke digital infrastructure.',
      interactiveTag: 'Interactive Live Systems',
      liveDemoBtn: 'Interactive Live Demo',
      liveSystemBadge: 'Live System',
      previewBtn: 'Preview',
      availableForBuild: 'Available for Build',
      inquireBtn: 'Inquire',
      openNewWindow: 'Open in new window',
      loadingPreview: 'Loading preview...',
      clickToExpand: 'Click to Expand',
      cards: {
        posTitle: 'POS',
        posDesc: 'Point of sale software with real-time inventory tracking, smart billing, payments, and sales analytics.',
        posTags: ['Inventory Sync', 'Smart Billing', 'Analytics'],
        topupTitle: 'Top-Up Diamond',
        topupDesc: 'Mobile Legends Bang Bang diamond top-up platform with instant account validation and automated payments.',
        topupTags: ['Instant Check', 'Fast Gateway', 'Automated'],
        webTitle: 'Web-APP',
        webDesc: 'High-performance responsive websites, e-commerce platforms, web applications, and management stores.',
        webTags: ['Next.js 15', 'Full-Stack UI', 'High Speed'],
        mobileTitle: 'Mobile App & Custom System',
        mobileDesc: 'Cross-platform iOS & Android mobile development, specialized business dashboards, and custom software systems tailored for your brand.',
        mobileTags: ['iOS & Android', 'Custom Systems', 'Production Ready'],
      },
    },
    portfolio: {
      badge: 'Cameraman & Visual Craft',
      title: 'Photography & Visual Stories',
      subtitle: 'High-resolution commercial and field photography, cinematic storytelling, and authentic moments captured with full-frame optics.',
      exploreBtn: 'EXPLORE ALL ALBUMS',
      skills: {
        portraitTitle: 'Portrait & Lifestyle',
        portraitBadge: '85mm Prime • Natural Light',
        portraitDesc: 'Emotive character framing, genuine facial expressions, and creamy optical background separation.',
        eventTitle: 'Event & Street Stills',
        eventBadge: '1/800s Shutter • Live Motion',
        eventDesc: 'Rapid candid captures, crowd energy, low-light indoor handling, and sharp unscripted storytelling.',
        cinemaTitle: 'Cameraman & Cinematography',
        cinemaBadge: '4K Motion • Gimbal Staged',
        cinemaDesc: 'Stabilized fluid pans, commercial framing, multi-camera live switching, and narrative motion pacing.',
        colorTitle: 'Color Grading & Post',
        colorBadge: 'DaVinci • 14-Bit RAW',
        colorDesc: 'High dynamic range preservation, skin-tone calibration, customized LUTs, and lossless master exports.',
      },
      telemetry: {
        bodyLabel: 'BODY:',
        bodyValue: 'Canon EOS 6D Mark II Full-Frame',
        lensLabel: 'LENS:',
        lensValue: 'EF 24-105mm f/4L IS II USM',
        workflowLabel: 'WORKFLOW:',
        workflowValue: '14-Bit RAW • Lightroom • DaVinci',
      },
      companionBook: {
        tag: 'Custom Visual Coverage',
        title: 'Book a Photo or Film Session',
        desc: 'Available for commercial brand campaigns, private portraits, travel shoots, and live event cameraman assignments.',
        btn: 'INQUIRE FOR AVAILABILITY',
      },
      companionArchive: {
        tag: 'Curated Visual Archive',
        title: 'Browse Full Gallery',
        desc: 'Explore all sub-albums, event series, behind-the-scenes moments, and high-resolution photo archives.',
        btn: 'EXPLORE ALL ARCHIVES',
      },
      photosCount: 'Photos',
      albumsCount: 'Albums',
    },
    galleryPage: {
      badge: 'Curated Photographic Archives',
      title: 'Photo Collections',
      subtitleTemplate: 'Explore {collections} collections and {photos} photographs across cultural landscapes, portraits, and commercial archives.',
      searchPlaceholder: 'Search collections and albums...',
      filterAll: 'All',
      filterFeatured: 'Featured',
      filterWithSubAlbums: 'With Sub-Albums',
      photosLabel: 'Photos',
      albumsLabel: 'Albums',
      albumFallback: 'Album',
      emptyTitle: 'No collections found',
      emptyNoMatch: 'No albums match your search query or active filter.',
      emptyNoCreated: 'Collections will appear here once created from the admin dashboard.',
      resetFilters: 'Reset Filters',
      backToGallery: 'Back to Gallery',
      backToCollection: 'Back to {title}',
    },
    videosPage: {
      badge: 'Motion Picture & Directing Showcase',
      title: 'Films & Motion',
      subtitle: 'Commercial cinema, documentary storytelling, and bespoke visual direction.',
      searchPlaceholder: 'Search films by title, concept, or tags...',
      viewGrid: 'Grid',
      viewCinematic: 'Cinematic',
      allCategory: 'All Productions',
      emptyTitle: 'No films found',
      emptyNoMatch: 'No motion works match your active search or category filters.',
      emptyNoCreated: 'Films will appear here once published from the admin dashboard.',
      resetFilters: 'Reset Filters',
    },
    aboutPage: {
      badge: 'Software Developer & Visual Storyteller',
      title: 'About Me',
      name: 'Peak Deth',
      tagline: 'Full-Stack Programming & Cinematic Photography Design',
      bio: 'A multidisciplinary Full-Stack Developer and Visual Artist bridging high-performance software engineering with cinematic photography and design. Dedicated to architecting robust enterprise systems, bespoke POS solutions, and modern mobile & web apps, while capturing evocative visual narratives and crafting refined aesthetic designs.',
      yearsLabel: 'Years Experience',
      setsLabel: 'Film & Photo Sets',
      craftLabel: 'Custom Color & Craft',
      initiateProject: 'Initiate a Project',
      viewWorks: 'View Works',
      location: 'Phnom Penh, Cambodia',
      travels: 'Travels Throughout Cambodia',
      portraitLabel: 'Portrait',
      disciplinesTag: 'Disciplines',
      disciplinesTitle: 'Creative & Technical Expertise',
      disciplinesSub: 'From pre-production creative direction through high-fidelity cinema mastering.',
      trajectoryTag: 'Trajectory',
      trajectoryTitle: 'Selected Experience & Productions',
      accoladesTag: 'Accolades',
      accoladesTitle: 'Honors & Industry Recognition',
      equipmentTag: 'Equipment',
      equipmentTitle: 'Camera Systems & Production Gear',
      equipmentSub: 'Industry-standard cinema cameras, prime optics, lighting, and aerial systems.',
      calloutTitle: "Let's bring your cinematic vision to life",
      calloutSub: 'Available for commercial productions, editorial photography, and documentary projects across Cambodia.',
      getInTouch: 'Get in Touch',
      exploreFilms: 'Explore Films',
    },
    contactPage: {
      title: "Let's Connect",
      subtitle: 'Direct channels and social profiles to get in touch.',
      emailLabel: 'Email',
      phoneLabel: 'Phone Number',
      locationLabel: 'Studio Location',
      websiteLabel: 'Website',
      copiedToast: 'Copied to clipboard',
      emptyTitle: 'Channels Temporarily Paused',
      emptyDesc: 'Direct contact channels are currently undergoing updates. Please check back shortly.',
      returnHome: 'Return to Home',
    },
    videosSection: {
      badge: 'Cinematic Reel',
      title: 'Featured Videos',
      subtitle: 'Motion productions, visual narratives, and technical showcase footage.',
      exploreBtn: 'EXPLORE ALL VIDEOS',
    },
    cta: {
      headline: 'Ready to Build Something Exceptional?',
      sub: "From high-concurrency software to striking visual productions, let's collaborate.",
      contactBtn: 'Start a Project',
      demosBtn: 'Live Demos',
    },
    header: {
      brandName: 'PEAK DETH',
      role: 'Software Developer & Cameraman',
      menuLabel: 'Menu',
      startProject: 'Start a Project',
    },
    common: {
      langEn: 'English',
      langKm: 'ភាសាខ្មែរ',
      langZh: '中文',
    },
  },
  km: {
    nav: {
      home: 'ទំព័រដើម',
      services: 'អ្នកអភិវឌ្ឍន៍ (Coding)',
      gallery: 'វិចិត្រសាល',
      videos: 'វីដេអូ',
      about: 'អំពីយើង',
      contact: 'ទំនាក់ទំនង',
    },
    mobileNavTags: {
      home: 'ទំព័រដើមចម្បង',
      services: 'ជំនាញសរសេរកូដ & ប្រព័ន្ធ',
      gallery: 'ស្នាដៃរូបថតវិចិត្រ',
      videos: 'វីដេអូបែបភាពយន្ត',
      about: 'ប្រវត្តិអ្នកអភិវឌ្ឍន៍',
      contact: 'ចាប់ផ្តើមគម្រោងថ្មី',
    },
    hero: {
      availableBadge: 'ទទួលការងារគម្រោងប្រព័ន្ធឌីជីថល & ភាពយន្ត',
      location: 'រាជធានីភ្នំពេញ, កម្ពុជា',
      craftDev: 'ស្ថាបត្យកម្ម Full-Stack Software',
      craftPhoto: 'ការថតភាពយន្ត & រូបភាពវិចិត្រ',
      subtitle: 'អ្នកអភិវឌ្ឍន៍កម្មវិធី & អ្នកថតភាពយន្ត • ប្រព័ន្ធ POS, វេបសាយ និងកម្មវិធីទូរស័ព្ទ • ផលិតភាពយន្ត និងរូបភាពកម្រិតខ្ពស់',
      ctaSystems: 'អ្នកអភិវឌ្ឍន៍ (Coding)',
      ctaVisual: 'ស្នាដៃរូបភាព',
      ctaContact: 'ទាក់ទងមកយើង',
      telemetryEng: 'បច្ចេកវិទ្យា & ភាពយន្ត:',
      telemetryEngItems: 'POS • វេបសាយ • កម្មវិធី • 4K CINEMA',
      telemetryStatus: 'ប្រព័ន្ធដំណើរការ & ត្រៀមរួចរាល់',
      scrollExplore: 'អូសចុះដើម្បីស្វែងយល់',
    },
    services: {
      badge: 'ជំនាញរបស់ខ្ញុំ • DEVELOPER (CODING)',
      title: 'អ្នកអភិវឌ្ឍន៍ (Coding)',
      subtitle: 'ការអភិវឌ្ឍន៍ប្រព័ន្ធ POS, វេបសាយ និងកម្មវិធីទូរស័ព្ទពេញលេញ (Full-Stack Coding)',
      interactiveTag: 'ការបង្ហាញប្រព័ន្ធដំណើរការផ្ទាល់',
      liveDemoBtn: 'ទស្សនាការបង្ហាញផ្ទាល់',
      liveSystemBadge: 'ប្រព័ន្ធដំណើរការផ្ទាល់',
      previewBtn: 'ទស្សនា',
      availableForBuild: 'ទទួលបង្កើតគម្រោង',
      inquireBtn: 'សាកសួរ',
      openNewWindow: 'បើកក្នុងផ្ទាំងថ្មី',
      loadingPreview: 'កំពុងដំណើរការ...',
      clickToExpand: 'ចុចដើម្បីពង្រីក',
      cards: {
        posTitle: 'ប្រព័ន្ធ POS',
        posDesc: 'កម្មវិធីគ្រប់គ្រងការលក់ និងស្តុកទំនិញក្នុងពេលជាក់ស្តែង គណនាវិក្កយបត្រ ការទូទាត់ និងស្ថិតិលក់ឆ្លាតវៃ។',
        posTags: ['គ្រប់គ្រងស្តុក', 'វិក្កយបត្ររហ័ស', 'ស្ថិតិទិន្នន័យ'],
        topupTitle: 'បញ្ចូលពេជ្រ Top-Up',
        topupDesc: 'ប្រព័ន្ធបញ្ចូលពេជ្រហ្គេម Mobile Legends ស្វ័យប្រវត្តិ ត្រួតពិនិត្យគណនីរហ័ស និងទូទាត់ប្រាក់ភ្លាមៗ។',
        topupTags: ['ឆែកគណនីភ្លាមៗ', 'ទូទាត់រហ័ស', 'ស្វ័យប្រវត្តិ'],
        webTitle: 'កម្មវិធី Web-APP',
        webDesc: 'វេបសាយពាណិជ្ជកម្មកម្រិតខ្ពស់ ប្រព័ន្ធគ្រប់គ្រងហាងទូរស័ព្ទ និងកម្មវិធីគេហទំព័រទំនើបល្បឿនលឿន។',
        webTags: ['Next.js 15', 'Full-Stack UI', 'ល្បឿនលឿន'],
        mobileTitle: 'កម្មវិធីទូរស័ព្ទ & ប្រព័ន្ធកុម្ម៉ង់',
        mobileDesc: 'អភិវឌ្ឍន៍កម្មវិធីទូរស័ព្ទ iOS & Android ផ្ទាំងគ្រប់គ្រងអាជីវកម្មឯកទេស និងប្រព័ន្ធកម្មវិធីតាមតម្រូវការជាក់ស្តែង។',
        mobileTags: ['iOS & Android', 'ប្រព័ន្ធកុម្ម៉ង់', 'ត្រៀមប្រើប្រាស់'],
      },
    },
    portfolio: {
      badge: 'អ្នកថតកាមេរ៉ា & សិល្បៈចក្ខុ',
      title: 'ការថតរូប & ស្នាដៃរឿងរ៉ាវចក្ខុ',
      subtitle: 'ការថតរូបពាណិជ្ជកម្ម និងព្រឹត្តិការណ៍កម្រិតច្បាស់ខ្ពស់ ការផលិតភាពយន្ត និងការផ្តិតយករូបភាពជាក់ស្តែងជាមួយកញ្ចក់ Full-Frame។',
      exploreBtn: 'មើលអាល់ប៊ុមទាំងអស់',
      skills: {
        portraitTitle: 'រូបភាពបុគ្គល & ជីវិតរស់នៅ',
        portraitBadge: '85mm Prime • ពន្លឺធម្មជាតិ',
        portraitDesc: 'ការរៀបចំស៊ុមបង្ហាញអារម្មណ៍ ទឹកមុខធម្មជាតិពិតៗ និងផ្ទៃខាងក្រោយព្រាលយ៉ាងស្រទន់។',
        eventTitle: 'រូបភាពព្រឹត្តិការណ៍ & តាមដងផ្លូវ',
        eventBadge: 'ល្បឿន 1/800s • ចលនាជាក់ស្តែង',
        eventDesc: 'ការផ្តិតយករូបភាពរហ័សទាន់ចិត្ត ថាមពលមនុស្សកុះករ ការគ្រប់គ្រងពន្លឺតិចក្នុងម្លប់ និងការនិទានរឿងយ៉ាងច្បាស់។',
        cinemaTitle: 'អ្នកថតកាមេរ៉ា & ភាពយន្ត',
        cinemaBadge: 'វីដេអូ 4K • Gimbal ជំនាញ',
        cinemaDesc: 'ការបង្វិលកាមេរ៉ារលូនមានលំនឹង ស៊ុមរូបភាពពាណិជ្ជកម្ម ការគ្រប់គ្រងកាមេរ៉ាច្រើន និងចង្វាក់វីដេអូល្អឥតខ្ចោះ។',
        colorTitle: 'ការកែពណ៌ & កាត់តកម្រិតខ្ពស់',
        colorBadge: 'DaVinci • 14-Bit RAW',
        colorDesc: 'រក្សាជួរពន្លឺ HDR ការកែតម្រូវពណ៌ស្បែកធម្មជាតិ LUTs ផ្ទាល់ខ្លួន និងការនាំចេញវីដេអូកម្រិតខ្ពស់បំផុត។',
      },
      telemetry: {
        bodyLabel: 'តួម៉ាស៊ីន:',
        bodyValue: 'Canon EOS 6D Mark II Full-Frame',
        lensLabel: 'កញ្ចក់ឡេន:',
        lensValue: 'EF 24-105mm f/4L IS II USM',
        workflowLabel: 'ដំណើរការការងារ:',
        workflowValue: '14-Bit RAW • Lightroom • DaVinci',
      },
      companionBook: {
        tag: 'សេវាកម្មថតរូបភាពផ្ទាល់ខ្លួន',
        title: 'កក់ការថតរូប ឬវីដេអូភាពយន្ត',
        desc: 'ទទួលការងារផ្សព្វផ្សាយពាណិជ្ជកម្ម រូបថតបុគ្គល ដំណើរកម្សាន្ត និងអ្នកថតកាមេរ៉ាព្រឹត្តិការណ៍ផ្ទាល់។',
        btn: 'សាកសួរព័ត៌មាន & កាលវិភាគ',
      },
      companionArchive: {
        tag: 'បណ្ណសាររូបភាពវិចិត្រ',
        title: 'ទស្សនាវិចិត្រសាលទាំងមូល',
        desc: 'ស្វែងយល់ពីអាល់ប៊ុមរងទាំងអស់ កម្រងរូបភាពព្រឹត្តិការណ៍ សកម្មភាពក្រៅឆាក និងបណ្ណសាររូបថតកម្រិតខ្ពស់។',
        btn: 'ចូលទស្សនាបណ្ណសារទាំងអស់',
      },
      photosCount: 'រូបថត',
      albumsCount: 'អាល់ប៊ុម',
    },
    galleryPage: {
      badge: 'បណ្ណសាររូបថតសម្រាំង',
      title: 'បណ្តុំរូបថត',
      subtitleTemplate: 'ស្វែងយល់ពី {collections} បណ្តុំ និង {photos} សន្លឹករូបថត នៃទេសភាពវប្បធម៌ រូបបញ្ឈរ និងបណ្ណសារពាណិជ្ជកម្ម។',
      searchPlaceholder: 'ស្វែងរកបណ្តុំ និងអាល់ប៊ុម...',
      filterAll: 'ទាំងអស់',
      filterFeatured: 'ពិសេស',
      filterWithSubAlbums: 'មានអាល់ប៊ុមរង',
      photosLabel: 'រូបថត',
      albumsLabel: 'អាល់ប៊ុម',
      albumFallback: 'អាល់ប៊ុម',
      emptyTitle: 'រកមិនឃើញបណ្តុំរូបថតទេ',
      emptyNoMatch: 'គ្មានអាល់ប៊ុមណាដែលត្រូវនឹងការស្វែងរក ឬតម្រងសកម្មឡើយ។',
      emptyNoCreated: 'បណ្តុំរូបថតនឹងបង្ហាញនៅទីនេះនៅពេលបង្កើតចេញពីផ្ទាំងគ្រប់គ្រង Admin។',
      resetFilters: 'កំណត់តម្រងឡើងវិញ',
      backToGallery: 'ត្រឡប់ទៅវិចិត្រសាល',
      backToCollection: 'ត្រឡប់ទៅ {title}',
    },
    videosPage: {
      badge: 'ការតាំងបង្ហាញស្នាដៃភាពយន្ត & ការដឹកនាំ',
      title: 'ខ្សែភាពយន្ត & ចលនារូបភាព',
      subtitle: 'ភាពយន្តពាណិជ្ជកម្ម រឿងរ៉ាវឯកសារ និងការដឹកនាំចក្ខុវិស័យកម្រិតខ្ពស់។',
      searchPlaceholder: 'ស្វែងរកភាពយន្តតាមចំណងជើង គំនិត ឬស្លាក...',
      viewGrid: 'ក្រឡាចត្រង្គ',
      viewCinematic: 'ភាពយន្ត',
      allCategory: 'ស្នាដៃទាំងអស់',
      emptyTitle: 'រកមិនឃើញខ្សែភាពយន្តទេ',
      emptyNoMatch: 'គ្មានស្នាដៃវីដេអូណាដែលត្រូវនឹងការស្វែងរក ឬប្រភេទតម្រងរបស់អ្នកឡើយ។',
      emptyNoCreated: 'ខ្សែភាពយន្តនឹងបង្ហាញនៅទីនេះនៅពេលផ្សព្វផ្សាយពីផ្ទាំងគ្រប់គ្រង Admin។',
      resetFilters: 'កំណត់តម្រងឡើងវិញ',
    },
    aboutPage: {
      badge: 'អ្នកអភិវឌ្ឍន៍កម្មវិធី & អ្នកថតរូបភាពវិចិត្រ',
      title: 'អំពីខ្ញុំ',
      name: 'ពាក្យ ដេត',
      tagline: 'ការអភិវឌ្ឍប្រព័ន្ធឌីជីថល (Programming) & ការច្នៃប្រឌិតរូបភាពវិចិត្រ (Photography & Design)',
      bio: 'ខ្ញុំជាអ្នកអភិវឌ្ឍន៍កម្មវិធីកម្រិត Full-Stack និងជាអ្នកថតរូបភាព-វីដេអូ ដែលរួមបញ្ចូលគ្នានូវជំនាញបច្ចេកវិទ្យាកូដដ៏រឹងមាំ ជាមួយនឹងសិល្បៈចក្ខុវិស័យប្រកបដោយភាពច្នៃប្រឌិត។ ខ្ញុំមានឯកទេសក្នុងការបង្កើតប្រព័ន្ធគ្រប់គ្រងសហគ្រាស POS, គេហទំព័រទំនើប និងកម្មវិធីទូរស័ព្ទ ក៏ដូចជាការផ្តិតយករូបភាព និងផលិតវីដេអូកម្រិតភាពយន្ត ដើម្បីនាំយកទាំងប្រសិទ្ធភាពអាជីវកម្ម និងសោភ័ណភាពរចនាដ៏ល្អឥតខ្ចោះ។',
      yearsLabel: 'ឆ្នាំនៃបទពិសោធន៍',
      setsLabel: 'សំណុំភាពយន្ត & រូបថត',
      craftLabel: 'គុណភាព & ពណ៌ស្តង់ដារ',
      initiateProject: 'ចាប់ផ្តើមគម្រោង',
      viewWorks: 'ទស្សនាស្នាដៃ',
      location: 'រាជធានីភ្នំពេញ, កម្ពុជា',
      travels: 'បំពេញការងារទូទាំងប្រទេសកម្ពុជា',
      portraitLabel: 'រូបបញ្ឈរ',
      disciplinesTag: 'ជំនាញឯកទេស',
      disciplinesTitle: 'ជំនាញច្នៃប្រឌិត និងបច្ចេកវិទ្យា',
      disciplinesSub: 'ចាប់ពីការដឹកនាំគំនិតច្នៃប្រឌិត រហូតដល់ការផលិត និងគ្រប់គ្រងប្រព័ន្ធបច្ចេកវិទ្យាកម្រិតខ្ពស់។',
      trajectoryTag: 'បទពិសោធន៍',
      trajectoryTitle: 'បទពិសោធន៍ការងារ & ការផលិត',
      accoladesTag: 'ពានរង្វាន់ & ការទទួលស្គាល់',
      accoladesTitle: 'កិត្តិយស និងការទទួលស្គាល់ក្នុងវិស័យការងារ',
      equipmentTag: 'ឧបករណ៍ & បច្ចេកវិទ្យា',
      equipmentTitle: 'ប្រព័ន្ធកាមេរ៉ា & ឧបករណ៍ផលិតកម្ម',
      equipmentSub: 'កាមេរ៉ាភាពយន្តស្តង់ដារ កញ្ចក់ឡេន prime ប្រព័ន្ធភ្លើង និងឧបករណ៍ថតពីលើអាកាស។',
      calloutTitle: 'រួមគ្នាបង្កើតចក្ខុវិស័យឌីជីថល និងភាពយន្តរបស់អ្នក',
      calloutSub: 'ទទួលការងារបង្កើតប្រព័ន្ធកម្មវិធី ការថតពាណិជ្ជកម្ម និងគម្រោងភាពយន្តទូទាំងប្រទេសកម្ពុជា។',
      getInTouch: 'ទាក់ទងមកយើង',
      exploreFilms: 'ទស្សនាភាពយន្ត',
    },
    contactPage: {
      title: 'ទំនាក់ទំនងមកកាន់យើង',
      subtitle: 'បណ្តាញផ្ទាល់ និងគណនីបណ្តាញសង្គមសម្រាប់ទំនាក់ទំនង។',
      emailLabel: 'អ៊ីមែល',
      phoneLabel: 'លេខទូរស័ព្ទ',
      locationLabel: 'ទីតាំងស្ទូឌីយោ',
      websiteLabel: 'គេហទំព័រ',
      copiedToast: 'បានចម្លងទៅកាន់ Clipboard',
      emptyTitle: 'បណ្តាញទំនាក់ទំនងត្រូវបានផ្អាកជាបណ្តោះអាសន្ន',
      emptyDesc: 'បណ្តាញទំនាក់ទំនងផ្ទាល់កំពុងស្ថិតក្នុងការកែលម្អ។ សូមត្រឡប់មកពិនិត្យឡើងវិញនៅពេលក្រោយ។',
      returnHome: 'ត្រឡប់ទៅទំព័រដើម',
    },
    videosSection: {
      badge: 'កម្រងវីដេអូភាពយន្ត',
      title: 'វីដេអូលេចធ្លោ',
      subtitle: 'ការផលិតវីដេអូកម្រិតភាពយន្ត រឿងរ៉ាវចក្ខុ និងស្នាដៃបច្ចេកទេសកម្រិតខ្ពស់។',
      exploreBtn: 'ទស្សនាវីដេអូទាំងអស់',
    },
    cta: {
      headline: 'ត្រៀមខ្លួនក្នុងការកសាងគម្រោងដ៏អស្ចារ្យ?',
      sub: 'ចាប់ពីកម្មវិធីកុំព្យូទ័រល្បឿនលឿន រហូតដល់ការផលិតភាពយន្តដ៏វិចិត្រ សូមទាក់ទងមកកាន់យើង។',
      contactBtn: 'ចាប់ផ្តើមគម្រោង',
      demosBtn: 'ទស្សនាការបង្ហាញ',
    },
    header: {
      brandName: 'ពាក្យ ដេត',
      role: 'អ្នកអភិវឌ្ឍន៍កម្មវិធី & អ្នកថតភាពយន្ត',
      menuLabel: 'ម៉ឺនុយ',
      startProject: 'ចាប់ផ្តើមគម្រោង',
    },
    common: {
      langEn: 'English',
      langKm: 'ភាសាខ្មែរ',
      langZh: '中文',
    },
  },
  zh: {
    nav: {
      home: '首页',
      services: '开发者 (Coding)',
      gallery: '作品集',
      videos: '视频',
      about: '关于',
      contact: '联系我们',
    },
    mobileNavTags: {
      home: '主页入口',
      services: '全栈开发与编程技能',
      gallery: '精选摄影作品',
      videos: '电影级动态影像',
      about: '开发者档案',
      contact: '发起合作项目',
    },
    hero: {
      availableBadge: '承接定制系统开发与影视摄制',
      location: '柬埔寨金边',
      craftDev: '全栈软件系统架构',
      craftPhoto: '电影级影视与摄影',
      subtitle: '全栈软件开发工程师 & 电影摄影师 • POS系统、Web及移动应用开发 • 商业摄影与电影级视频制作',
      ctaSystems: '开发者技能 (Coding)',
      ctaVisual: '视觉作品',
      ctaContact: '联系我们',
      telemetryEng: '工程与影像:',
      telemetryEngItems: 'POS • 网站 • 移动端 • 4K电影',
      telemetryStatus: '系统运行中 • 随时就绪',
      scrollExplore: '向下滚动探索',
    },
    services: {
      badge: '我的专业技能 • DEVELOPER (CODING)',
      title: '开发者技能 (Coding)',
      subtitle: '企业级生产软件、全栈Web与移动端开发、POS架构设计及实时定制软件系统。',
      interactiveTag: '交互式实时系统演示',
      liveDemoBtn: '在线交互演示',
      liveSystemBadge: '在线运行系统',
      previewBtn: '预览',
      availableForBuild: '可承接定制',
      inquireBtn: '咨询',
      openNewWindow: '在新窗口中打开',
      loadingPreview: '加载预览中...',
      clickToExpand: '点击放大查看',
      cards: {
        posTitle: 'POS 收银系统',
        posDesc: '企业级收银系统，支持实时多门店库存同步、智能账单管理、多渠道支付与数据分析。',
        posTags: ['库存同步', '智能开单', '数据分析'],
        topupTitle: '游戏钻石充值系统',
        topupDesc: '无缝对接 MLBB 等游戏自动化充值平台，支持极速账号校验与自动化资金流水结算。',
        topupTags: ['秒级校验', '极速通道', '全自动化'],
        webTitle: 'Web 应用与电商系统',
        webDesc: '高性能响应式网站、手机数码店铺管理系统以及现代化企业级 Web 数字应用。',
        webTags: ['Next.js 15', '全栈 UI', '极速加载'],
        mobileTitle: '移动 App 与定制系统',
        mobileDesc: '跨平台 iOS & Android 移动端应用开发、企业定制仪表板及根据品牌深度量身定制的数字系统。',
        mobileTags: ['iOS & Android', '定制化架构', '生产级就绪'],
      },
    },
    portfolio: {
      badge: '摄影摄像与视觉艺术',
      title: '摄影与光影视觉故事',
      subtitle: '高分辨率商业与现场摄影、电影级叙事，使用全画幅光学镜头捕捉精彩瞬间。',
      exploreBtn: '浏览全部相册',
      skills: {
        portraitTitle: '人像与生活写真',
        portraitBadge: '85mm 定焦 • 自然光',
        portraitDesc: '情感丰富的人物构图，自然的真实面部神态，以及柔美通透的虚化效果。',
        eventTitle: '活动与街头纪实',
        eventBadge: '1/800s 快门 • 动态抓拍',
        eventDesc: '快速抓拍真实动态，捕捉现场人群氛围，出色的暗光室内表现与生动纪实。',
        cinemaTitle: '电影摄制与机位把控',
        cinemaBadge: '4K 高清动态 • 稳定器运镜',
        cinemaDesc: '平稳流畅的镜头运镜，商业影视构图，多机位实时切换与精准故事节奏。',
        colorTitle: '调色与后期精修',
        colorBadge: 'DaVinci • 14-Bit RAW',
        colorDesc: '保留高动态范围 HDR，精准校准自然肤色，定制化 LUT 风格调色与无损母带导出。',
      },
      telemetry: {
        bodyLabel: '机身:',
        bodyValue: 'Canon EOS 6D Mark II 全画幅',
        lensLabel: '镜头:',
        lensValue: 'EF 24-105mm f/4L IS II USM',
        workflowLabel: '工作流:',
        workflowValue: '14-Bit RAW • Lightroom • DaVinci',
      },
      companionBook: {
        tag: '定制化影像摄制',
        title: '预约拍摄与影视制作',
        desc: '承接商业品牌宣传片、个人高端写真、旅拍及各类大型活动现场摄像任务。',
        btn: '咨询档期与合作',
      },
      companionArchive: {
        tag: '精选影像档案库',
        title: '浏览完整作品图库',
        desc: '探索所有子相册、系列活动图集、幕后花絮以及高分辨率摄影归档。',
        btn: '浏览全部档案',
      },
      photosCount: '张照片',
      albumsCount: '个相册',
    },
    galleryPage: {
      badge: '精选摄影档案',
      title: '摄影作品集',
      subtitleTemplate: '探索跨越文化风貌、人物肖像及商业档案的 {collections} 个合集与 {photos} 张精选照片。',
      searchPlaceholder: '搜索合集与相册...',
      filterAll: '全部',
      filterFeatured: '精选',
      filterWithSubAlbums: '含子相册',
      photosLabel: '张照片',
      albumsLabel: '个相册',
      albumFallback: '相册',
      emptyTitle: '未找到相关合集',
      emptyNoMatch: '没有符合您搜索条件或筛选器的相册。',
      emptyNoCreated: '从管理后台创建后，作品集将显示在此处。',
      resetFilters: '重置筛选',
      backToGallery: '返回作品集',
      backToCollection: '返回 {title}',
    },
    videosPage: {
      badge: '电影级动态精选',
      title: '电影与动态影像',
      subtitle: '商业影片、纪录叙事与定制级视觉导演。',
      searchPlaceholder: '按片名、概念或标签搜索影片...',
      viewGrid: '网格',
      viewCinematic: '影院模式',
      allCategory: '全部作品',
      emptyTitle: '未找到影片',
      emptyNoMatch: '没有符合您搜索条件或分类的作品。',
      emptyNoCreated: '从管理后台发布后，影片将显示在此处。',
      resetFilters: '重置筛选',
    },
    aboutPage: {
      badge: '全栈开发工程师 & 视觉叙事摄影师',
      title: '关于我',
      name: 'Peak Deth',
      tagline: '全栈编程开发架构 与 电影级视觉摄影设计',
      bio: '兼具全栈软件工程与视觉艺术创作的双重专长，将坚固高效的底层代码架构与电影级摄影美学设计融为一体。专注于构建企业级 POS 管理系统、现代化响应式网站及跨平台移动应用，同时以专业镜头捕捉动人视觉叙事，提供卓越的数字化效能与艺术美感体验。',
      yearsLabel: '年专业经验',
      setsLabel: '影视与摄影创作',
      craftLabel: '精细调色与定制',
      initiateProject: '发起项目',
      viewWorks: '浏览作品',
      location: '柬埔寨 金边',
      travels: '承接全柬埔寨及国际摄制',
      portraitLabel: '肖像',
      disciplinesTag: '专业领域',
      disciplinesTitle: '创意与技术专长',
      disciplinesSub: '从前期创意指导到高品质电影级后期母带制作。',
      trajectoryTag: '职业轨迹',
      trajectoryTitle: '精选项目经验与作品',
      accoladesTag: '荣誉奖项',
      accoladesTitle: '业界认可与殊荣',
      equipmentTag: '设备与技术',
      equipmentTitle: '摄影机系统与制作设备',
      equipmentSub: '行业标准电影摄影机、定焦镜头组、专业灯光与航拍系统。',
      calloutTitle: '让我们一起将您的愿景变为现实',
      calloutSub: '承接全柬埔寨及国际商业制作、编辑摄影与纪录片项目。',
      getInTouch: '取得联系',
      exploreFilms: '探索影片',
    },
    contactPage: {
      title: '保持联系',
      subtitle: '直接渠道与社交媒体档案，随时沟通。',
      emailLabel: '电子邮箱',
      phoneLabel: '电话号码',
      locationLabel: '工作室地点',
      websiteLabel: '官方网站',
      copiedToast: '已复制到剪贴板',
      emptyTitle: '联系通道暂时维护中',
      emptyDesc: '直接联系通道正在更新维护中，请稍后查看。',
      returnHome: '返回首页',
    },
    videosSection: {
      badge: '电影级动态精选',
      title: '精选视频作品',
      subtitle: '动态影视制作、视觉叙事大片与技术展示镜头。',
      exploreBtn: '浏览全部视频',
    },
    cta: {
      headline: '准备好打造卓越的项目了吗？',
      sub: '从高并发数字系统开发到震撼的视觉影片，让我们携手共创。',
      contactBtn: '启动项目',
      demosBtn: '在线演示',
    },
    header: {
      brandName: 'PEAK DETH',
      role: '全栈开发工程师 & 电影摄影师',
      menuLabel: '菜单',
      startProject: '发起项目',
    },
    common: {
      langEn: 'English',
      langKm: 'ភាសាខ្មែរ',
      langZh: '中文',
    },
  },
}
