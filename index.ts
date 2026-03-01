export enum Language {
    EN = 'en',
    MR = 'mr'
}

export interface Translation {
    title: string;
    subtitle: string;
    home: string;
    about: string;
    gallery: string;
    events: string;
    contact: string;
    donate: string;
    read_more: string;
    student_portal: string;
    student_list: string;
    register_student: string;
    search_student: string;
    export_csv: string;
    pending_requests: string;
    assign_roll_no: string;
    approve: string;
    reject: string;
    no_students: string;
    student_photo: string;
    roll_no: string;
    student_name: string;
    father_name: string;
    dob: string;
    blood_group: string;
    mobile_no: string;
    aadhar_no: string;
    occupation: string;
    address: string;
    joined_date: string;
    password_required: string;
    enter_password: string;
    submit: string;
    exit_admin: string;
    admin_access: string;
    application_submitted: string;
    waiting_approval: string;
    latest_news: string;
    hero_title: string;
    hero_subtitle: string;

    // New keys
    select_blood_group: string;
    declaration: string;
    admin_upload: string;
    write_message: string;
    upload_media: string;
    cancel: string;
    announcements: string;
    no_announcements: string;
    posted_on: string;
    latest_updates: string;
    copyright: string;
    group_highlights: string;
    see_more: string;
    about_content: string;
    contact_info: string;
    follow_us: string;
    share: string;
    copy_link: string;
    copied: string;
    slogan: string;
    stats_members: string;
    stats_years: string;
    stats_events: string;
    our_community: string;
    group_gallery: string;
    menu: string;
    caption_message: string;
    tap_to_upload: string;
    saving: string;
    invalid_password: string;
    admin_post: string;
    see_less: string;
    address_details: string;
    check_status: string;
    check_application_status: string;
    enter_mobile_search: string;
    status_pending: string;
    status_approved: string;

    your_roll_no: string;
    search: string;
    application_not_found: string;
    video_gallery: string;
    watch_video: string;
    close_video: string;
    upload_file: string;
    youtube_link: string;
}

export interface Student {
    id: number;
    rollNumber: string;
    name: string;
    fatherName: string;
    mobileNumber: string;
    aadharNumber: string;
    photoUrl: string;
    joinedDate: Date | string;
    status: 'approved' | 'pending';
    dob?: string;
    bloodGroup?: string;
    occupation?: string;
    address?: string;
}

export interface Photo {
    id: number;
    url: string;
    alt: string;
}

export interface Video {
    id: number;
    url: string;
    thumbnail: string;
    title: string;
    type: 'youtube' | 'local';
}

export interface Announcement {
    id: number;
    message: string;
    mediaUrl: string | null;
    mediaType: 'image' | 'video' | 'none';
    timestamp: Date;
}
