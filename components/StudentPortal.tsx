import React, { useState, useEffect, useCallback } from 'react';
import { X, UserPlus, Users, Search, UploadCloud, User as UserIcon, Smartphone, CreditCard, UserCheck, CheckSquare, Sparkles, AlertCircle, Lock, Unlock, Calendar, ShieldCheck, Download, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, MapPin, Briefcase, Droplet } from 'lucide-react';
import { Translation, Language, Student } from '../types';
import { ADMIN_EMAILS, ADMIN_PASSWORD } from '../constants';
import { api } from '../api';

interface StudentPortalProps {
    isOpen: boolean;
    onClose: () => void;
    t: Translation;
    lang: Language;
}

// Image Compression Utility
const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const scaleSize = MAX_WIDTH / img.width;
                const finalScale = scaleSize < 1 ? scaleSize : 1;
                canvas.width = img.width * finalScale;
                canvas.height = img.height * finalScale;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};

const StudentPortal: React.FC<StudentPortalProps> = ({ isOpen, onClose, t, lang }) => {
    const [activeTab, setActiveTab] = useState<'list' | 'register' | 'status'>('register');

    // Data State
    const [students, setStudents] = useState<Student[]>([]);
    const [pendingStudents, setPendingStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalApproved, setTotalApproved] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 12;

    // Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Admin Mode State
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [editingRollNo, setEditingRollNo] = useState<{ id: number, roll: string } | null>(null);

    // Status Check State
    const [statusSearchMobile, setStatusSearchMobile] = useState('');
    const [statusResult, setStatusResult] = useState<Student | null>(null);
    const [statusSearched, setStatusSearched] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [aadhar, setAadhar] = useState('');
    const [mobile, setMobile] = useState('');
    const [dob, setDob] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [occupation, setOccupation] = useState('');
    const [address, setAddress] = useState('');
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [agreed, setAgreed] = useState(false);

    // Validation State
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const [isProcessing, setIsProcessing] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    // Debounce search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch Data
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch Approved Students (Paginated)
            const approvedRes = await api.getStudents(currentPage, ITEMS_PER_PAGE, debouncedSearch, 'approved');
            setStudents(approvedRes.data);
            setTotalApproved(approvedRes.total);
            setTotalPages(approvedRes.totalPages);

            // Fetch Pending Students (Only if admin, and maybe all of them or first page)
            if (isAdminMode) {
                const pendingRes = await api.getStudents(1, 50, '', 'pending');
                setPendingStudents(pendingRes.data);
            }
        } catch (e) {
            console.error("Failed to fetch students", e);
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearch, isAdminMode]);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen, fetchData]);


    // Reset form when modal closes/opens
    useEffect(() => {
        if (!isOpen) {
            resetForm();
            setActiveTab('register');
            setIsAdminMode(false);
            setShowEmailInput(false);
            setEmailInput('');
            setPasswordInput('');
            setRegistrationSuccess(false);
            setSearchTerm('');
            setStatusSearchMobile('');
            setStatusResult(null);
            setStatusSearched(false);
        }
    }, [isOpen]);

    const resetForm = () => {
        setName('');
        setFatherName('');
        setAadhar('');
        setMobile('');
        setDob('');
        setBloodGroup('');
        setOccupation('');
        setAddress('');
        setPhotoFile(null);
        setAgreed(false);
        setErrors({});
        setTouched({});
        setRegistrationSuccess(false);
    };

    if (!isOpen) return null;

    const handleAdminToggle = () => {
        if (isAdminMode) {
            setIsAdminMode(false);
        } else {
            setShowEmailInput(true);
        }
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (ADMIN_EMAILS.some(email => email.toLowerCase() === emailInput.toLowerCase()) && passwordInput === ADMIN_PASSWORD) {
            setIsAdminMode(true);
            setShowEmailInput(false);
            setEmailInput('');
            setPasswordInput('');
        } else {
            alert("Invalid Email or Password");
        }
    };

    const handleExportCSV = async () => {
        // Fetch ALL approved students for export (might be heavy, consider server-side export in real app)
        // For now, fetch with large limit
        const allData = await api.getStudents(1, 10000, '', 'approved');

        const headers = [
            t.roll_no,
            t.student_name,
            t.father_name,
            t.mobile_no,
            t.aadhar_no,
            t.blood_group,
            t.address,
            t.joined_date
        ];

        const rows = allData.data.map(s => [
            s.rollNumber,
            s.name,
            s.fatherName,
            s.mobileNumber,
            s.aadharNumber,
            s.bloodGroup || '-',
            s.address || '-',
            new Date(s.joinedDate).toLocaleDateString()
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.map(c => `"${c}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `maratha_members_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleApprove = async (studentId: number) => {
        if (!editingRollNo || editingRollNo.id !== studentId || !editingRollNo.roll.trim()) {
            alert("Please enter a valid Roll Number.");
            return;
        }

        try {
            await api.updateStudent(studentId, {
                rollNumber: editingRollNo.roll,
                status: 'approved'
            });
            alert("Student Approved Successfully!");
            fetchData(); // Refresh list
        } catch (e) {
            console.error(e);
            alert("Failed to approve student.");
        }
    };

    const handleReject = async (studentId: number) => {
        if (!window.confirm("Are you sure you want to reject and delete this application?")) return;
        try {
            await api.deleteStudent(studentId);
            alert("Application Rejected.");
            fetchData();
        } catch (e) {
            console.error(e);
            alert("Failed to reject student.");
        }
    };

    // --- Validation Helpers ---
    const validateField = (field: string, value: string | File | null) => {
        let error = '';
        switch (field) {
            case 'name':
                if (typeof value === 'string' && value.trim().length < 2) error = 'Name is too short.';
                break;
            case 'fatherName':
                if (typeof value === 'string' && value.trim().length < 2) error = 'Name is too short.';
                break;
            case 'aadhar':
                const cleanAadhar = typeof value === 'string' ? value.replace(/\s/g, '') : '';
                if (cleanAadhar.length !== 12) error = 'Aadhar must be exactly 12 digits.';
                break;
            case 'mobile':
                const cleanMobile = typeof value === 'string' ? value.replace(/\D/g, '') : '';
                if (cleanMobile.length !== 10) error = 'Mobile must be exactly 10 digits.';
                break;
            case 'photo':
                if (!value) error = 'Photo is required.';
                break;
            case 'address':
                if (typeof value === 'string' && value.trim().length < 5) error = 'Address is too short.';
                break;
        }
        setErrors(prev => {
            const next = { ...prev };
            if (error) next[field] = error;
            else delete next[field];
            return next;
        });
        return error;
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        let val: string | null = '';
        if (field === 'name') val = name;
        if (field === 'fatherName') val = fatherName;
        if (field === 'aadhar') val = aadhar;
        if (field === 'mobile') val = mobile;
        if (field === 'address') val = address;
        validateField(field, val);
    };

    const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 12) val = val.slice(0, 12);
        const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
        setAadhar(formatted);
        if (touched.aadhar || val.length === 12) validateField('aadhar', formatted);
    };

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '');
        if (val.length > 10) return;
        setMobile(val);
        if (touched.mobile || val.length === 10) validateField('mobile', val);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setTouched(prev => ({ ...prev, photo: true }));
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, photo: "Only image files allowed." }));
                setPhotoFile(null);
                return;
            }
            setErrors(prev => { const { photo, ...rest } = prev; return rest; });
            setPhotoFile(file);
        } else {
            validateField('photo', null);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const nameErr = validateField('name', name);
        const fatherErr = validateField('fatherName', fatherName);
        const aadharErr = validateField('aadhar', aadhar);
        const mobileErr = validateField('mobile', mobile);
        const addressErr = validateField('address', address);
        const photoErr = !photoFile ? validateField('photo', null) : '';

        setTouched({ name: true, fatherName: true, aadhar: true, mobile: true, photo: true, address: true });

        if (nameErr || fatherErr || aadharErr || mobileErr || addressErr || photoErr || !agreed || Object.keys(errors).length > 0) return;

        setIsProcessing(true);
        try {
            // COMPRESS IMAGE HERE (Base64) - This keeps the file small for GitHub
            const photoUrl = await compressImage(photoFile!);

            const tempRollNumber = `PENDING-${Date.now().toString().slice(-6)}`;

            const newStudent = {
                name,
                fatherName,
                aadharNumber: aadhar,
                mobileNumber: mobile,
                photoUrl,
                rollNumber: tempRollNumber,
                joinedDate: new Date(),
                status: 'pending' as const,
                dob,
                bloodGroup,
                occupation,
                address
            };

            await api.addStudent(newStudent);
            setRegistrationSuccess(true);
            fetchData(); // refresh list in background

        } catch (error) {
            console.error(error);
            alert("Error registering student");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-[90] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">

            {/* Email Modal for Admin Mode */}
            {showEmailInput && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <ShieldCheck className="text-saffron-600" />
                                Admin Email Required
                            </h3>
                            <button onClick={() => setShowEmailInput(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEmailSubmit}>
                            <input
                                type="email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 mb-4 outline-none focus:ring-2 focus:ring-saffron-500"
                                placeholder="Enter Admin Email"
                                autoFocus
                            />
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 mb-4 outline-none focus:ring-2 focus:ring-saffron-500"
                                placeholder={t.enter_password || "Enter Admin Password"}
                            />
                            <button
                                type="submit"
                                className="w-full bg-saffron-600 text-white font-bold py-2 rounded-lg hover:bg-saffron-700 transition-colors"
                            >
                                {t.submit}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className={`text-white p-5 flex justify-between items-center shadow-lg shrink-0 transition-colors duration-500 ${isAdminMode ? 'bg-gray-800' : 'bg-gradient-to-r from-saffron-600 to-saffron-700'}`}>
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                        <Sparkles size={20} className={isAdminMode ? "text-cyan-300" : "text-yellow-200"} />
                    </div>
                    <h2 className={`text-2xl font-bold tracking-tight ${lang === Language.MR ? 'font-marathi' : ''}`}>
                        {t.student_portal} {isAdminMode && <span className="text-xs bg-white/20 px-2 py-0.5 rounded ml-2 text-cyan-200">ADMIN VIEW</span>}
                    </h2>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleAdminToggle}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isAdminMode
                            ? 'bg-red-500/20 text-red-100 border border-red-500/50 hover:bg-red-500/40'
                            : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                            }`}
                    >
                        {isAdminMode ? <Unlock size={14} /> : <Lock size={14} />}
                        <span className="hidden sm:inline">
                            {isAdminMode ? t.exit_admin : t.admin_access}
                        </span>
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all hover:rotate-90 duration-300">
                        <X size={28} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-white shrink-0 shadow-sm z-10">
                {isAdminMode && (
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`flex-1 py-4 flex justify-center items-center gap-2 font-bold transition-all relative overflow-hidden ${activeTab === 'list'
                            ? 'text-saffron-700 bg-saffron-50'
                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                            }`}
                    >
                        {activeTab === 'list' && <div className="absolute bottom-0 left-0 w-full h-1 bg-saffron-600"></div>}
                        <Users size={20} />
                        <span className={lang === Language.MR ? 'font-marathi text-lg' : 'uppercase tracking-wide text-sm'}>{t.student_list}</span>
                    </button>
                )}

                <button
                    onClick={() => setActiveTab('register')}
                    className={`flex-1 py-4 flex justify-center items-center gap-2 font-bold transition-all relative overflow-hidden ${activeTab === 'register'
                        ? 'text-saffron-700 bg-saffron-50'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                >
                    {activeTab === 'register' && <div className="absolute bottom-0 left-0 w-full h-1 bg-saffron-600"></div>}
                    <UserPlus size={20} />
                    <span className={lang === Language.MR ? 'font-marathi text-lg' : 'uppercase tracking-wide text-sm'}>{t.register_student}</span>
                </button>
                <button
                    onClick={() => setActiveTab('status')}
                    className={`flex-1 py-4 flex justify-center items-center gap-2 font-bold transition-all relative overflow-hidden ${activeTab === 'status'
                        ? 'text-saffron-700 bg-saffron-50'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                >
                    {activeTab === 'status' && <div className="absolute bottom-0 left-0 w-full h-1 bg-saffron-600"></div>}
                    <Search size={20} />
                    <span className={lang === Language.MR ? 'font-marathi text-lg' : 'uppercase tracking-wide text-sm'}>{t.check_status}</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto bg-gray-50 p-4 md:p-8">

                {/* --- LIST VIEW --- */}
                {activeTab === 'list' && (
                    <div className="max-w-7xl mx-auto">
                        {/* Search Bar & Export */}
                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            <div className="flex-1 bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 border border-gray-200 focus-within:ring-2 focus-within:ring-saffron-400 transition-all">
                                <Search className="text-gray-400" size={24} />
                                <input
                                    type="text"
                                    placeholder={t.search_student}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 outline-none text-gray-700 text-lg placeholder-gray-400 bg-transparent"
                                />
                            </div>
                            {isAdminMode && (
                                <button
                                    onClick={handleExportCSV}
                                    className="bg-green-600 text-white px-6 py-4 rounded-xl font-bold shadow-sm hover:bg-green-700 hover:shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
                                >
                                    <Download size={20} />
                                    <span>{t.export_csv}</span>
                                </button>
                            )}
                        </div>

                        {/* --- ADMIN: PENDING APPROVALS SECTION --- */}
                        {isAdminMode && pendingStudents.length > 0 && (
                            <div className="mb-10 bg-orange-50 rounded-2xl border border-orange-200 p-6">
                                <h3 className={`text-xl font-bold text-orange-800 mb-4 flex items-center gap-2 ${lang === Language.MR ? 'font-marathi' : ''}`}>
                                    <Clock className="text-orange-600" />
                                    {t.pending_requests} <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full">{pendingStudents.length}</span>
                                </h3>

                                <div className="grid grid-cols-1 gap-4">
                                    {pendingStudents.map(student => (
                                        <div key={student.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
                                            {/* Photo & Basic Info */}
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                                    <img src={student.photoUrl} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg text-gray-800">{student.name}</h4>
                                                    <p className="text-sm text-gray-500">Father: {student.fatherName}</p>
                                                    <p className="text-sm text-gray-500 font-mono">Mob: {student.mobileNumber} | Adhr: {student.aadharNumber}</p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                                                <div className="flex flex-col w-full sm:w-auto">
                                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1">{t.assign_roll_no}</label>
                                                    <input
                                                        type="text"
                                                        placeholder={`Next: TGM-${String(totalApproved + 1).padStart(3, '0')}`}
                                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono w-full sm:w-40 focus:ring-2 focus:ring-saffron-500 outline-none"
                                                        value={editingRollNo?.id === student.id ? editingRollNo.roll : ''}
                                                        onFocus={() => {
                                                            if (editingRollNo?.id !== student.id) {
                                                                setEditingRollNo({
                                                                    id: student.id,
                                                                    roll: `TGM-${String(totalApproved + 1).padStart(3, '0')}`
                                                                });
                                                            }
                                                        }}
                                                        onChange={(e) => setEditingRollNo({ id: student.id, roll: e.target.value })}
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => handleApprove(student.id)}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 w-full sm:w-auto mt-auto h-[42px] flex items-center justify-center gap-1"
                                                >
                                                    <CheckCircle size={16} /> {t.approve}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(student.id)}
                                                    className="bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded-lg font-bold text-sm hover:bg-red-100 w-full sm:w-auto mt-auto h-[42px] flex items-center justify-center gap-1"
                                                >
                                                    <XCircle size={16} /> {t.reject}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* --- APPROVED LIST (PAGINATED) --- */}
                        {loading ? (
                            <div className="py-20 flex justify-center">
                                <div className="w-10 h-10 border-4 border-saffron-200 border-t-saffron-600 rounded-full animate-spin"></div>
                            </div>
                        ) : students.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Users size={48} className="text-gray-300" />
                                </div>
                                <h3 className={`text-xl font-bold text-gray-500 mb-2 ${lang === Language.MR ? 'font-marathi' : ''}`}>{t.no_students}</h3>
                                {!isAdminMode && <p className="text-gray-400 mb-8">Be the first to join the community!</p>}
                            </div>
                        ) : (
                            <>
                                {isAdminMode ? (
                                    /* --- ADMIN TABLE VIEW --- */
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-gray-800 text-white uppercase text-xs tracking-wider font-bold">
                                                    <tr>
                                                        <th className="p-4 w-16 text-center">#</th>
                                                        <th className="p-4">{t.student_photo}</th>
                                                        <th className="p-4">{t.roll_no}</th>
                                                        <th className="p-4">{t.student_name}</th>
                                                        <th className="p-4">{t.father_name}</th>
                                                        <th className="p-4">{t.dob}</th>
                                                        <th className="p-4">{t.blood_group}</th>
                                                        <th className="p-4">{t.mobile_no}</th>
                                                        <th className="p-4">{t.aadhar_no}</th>
                                                        <th className="p-4">{t.occupation}</th>
                                                        <th className="p-4">{t.address}</th>
                                                        <th className="p-4">{t.joined_date}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                                    {students.map((student, idx) => (
                                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="p-4 text-center text-gray-400">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                                                            <td className="p-4">
                                                                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
                                                                    <img src={student.photoUrl} alt="" className="w-full h-full object-cover" />
                                                                </div>
                                                            </td>
                                                            <td className="p-4 font-mono font-bold text-saffron-700">{student.rollNumber}</td>
                                                            <td className={`p-4 font-bold text-gray-900 ${lang === Language.MR ? 'font-marathi text-base' : ''}`}>{student.name}</td>
                                                            <td className={`p-4 ${lang === Language.MR ? 'font-marathi' : ''}`}>{student.fatherName}</td>

                                                            {/* New Columns */}
                                                            <td className="p-4 whitespace-nowrap">{student.dob ? new Date(student.dob).toLocaleDateString() : '-'}</td>
                                                            <td className="p-4 font-bold text-red-600">{student.bloodGroup || '-'}</td>

                                                            <td className="p-4 font-mono">{student.mobileNumber}</td>
                                                            <td className="p-4 font-mono text-gray-500">{student.aadharNumber}</td>

                                                            {/* New Columns */}
                                                            <td className={`p-4 ${lang === Language.MR ? 'font-marathi' : ''}`}>{student.occupation || '-'}</td>
                                                            <td className={`p-4 min-w-[200px] ${lang === Language.MR ? 'font-marathi' : ''}`}>{student.address || '-'}</td>

                                                            <td className="p-4 text-gray-500">{new Date(student.joinedDate).toLocaleDateString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    /* --- PUBLIC CARD VIEW --- */
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in">
                                        {students.map((student) => (
                                            <div key={student.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1">
                                                <div className="relative h-24 bg-gradient-to-r from-saffron-400 to-saffron-600">
                                                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                                                        <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                                                            <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pt-14 pb-6 px-6 text-center flex-1">
                                                    <h3 className={`text-lg font-bold text-gray-800 mb-1 group-hover:text-saffron-700 transition-colors ${lang === Language.MR ? 'font-marathi text-xl' : ''}`}>
                                                        {student.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mb-4 font-mono font-bold text-saffron-800 bg-saffron-50 inline-block px-2 py-0.5 rounded">
                                                        {student.rollNumber}
                                                    </p>


                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Pagination Controls */}
                                <div className="flex justify-center items-center gap-4 mt-8">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-full border border-gray-300 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <span className="font-bold text-gray-600">
                                        Page {currentPage} of {totalPages || 1}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className="p-2 rounded-full border border-gray-300 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* --- REGISTER VIEW --- */}
                {activeTab === 'register' && (
                    <div className="max-w-5xl mx-auto">
                        {registrationSuccess ? (
                            <div className="bg-green-50 rounded-2xl p-10 text-center border border-green-200 animate-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={48} />
                                </div>
                                <h3 className={`text-2xl font-bold text-green-800 mb-2 ${lang === Language.MR ? 'font-marathi' : ''}`}>
                                    {t.application_submitted}
                                </h3>
                                <p className={`text-green-700 mb-8 ${lang === Language.MR ? 'font-marathi text-lg' : ''}`}>
                                    {t.waiting_approval}
                                </p>
                                <button
                                    onClick={() => {
                                        resetForm();
                                        setActiveTab('register');
                                        fetchData();
                                    }}
                                    className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors shadow-lg"
                                >
                                    Back to List
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row animate-in slide-in-from-bottom-4 fade-in duration-500">
                                {/* Left Side: Photo Upload visual */}
                                <div className={`md:w-1/3 p-8 flex flex-col items-center justify-start border-r transition-colors duration-300 ${errors.photo ? 'bg-red-50 border-red-100' : 'bg-saffron-50 border-saffron-100'}`}>
                                    <h3 className={`text-lg font-bold text-saffron-800 mb-6 text-center ${lang === Language.MR ? 'font-marathi' : ''}`}>
                                        {t.student_photo}
                                    </h3>

                                    <div className={`w-48 h-48 rounded-full border-4 shadow-lg overflow-hidden bg-white relative group cursor-pointer transition-all ${errors.photo ? 'border-red-400 ring-4 ring-red-100' : 'border-white ring-4 ring-saffron-200'}`}>
                                        {photoFile ? (
                                            <img
                                                src={URL.createObjectURL(photoFile)}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
                                                <UserIcon size={64} />
                                            </div>
                                        )}

                                        {/* Overlay Input */}
                                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <div className="text-white flex flex-col items-center">
                                                <UploadCloud size={32} />
                                                <span className="text-xs font-bold mt-1">CHANGE</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </label>
                                    </div>
                                    {errors.photo ? (
                                        <div className="flex items-center gap-1 mt-4 text-red-500 text-xs font-bold animate-pulse">
                                            <AlertCircle size={14} />
                                            <span>{errors.photo}</span>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-500 mt-4 text-center">
                                            Click to upload.<br />Max size 3MB.
                                        </p>
                                    )}
                                </div>

                                {/* Right Side: Form Fields */}
                                <div className="md:w-2/3 p-6 md:p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className={`text-2xl font-bold text-gray-800 ${lang === Language.MR ? 'font-marathi' : ''}`}>
                                            {t.register_student}
                                        </h3>
                                        <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold font-mono">
                                            PENDING
                                        </div>
                                    </div>

                                    <form onSubmit={handleRegister} className="space-y-6">

                                        {/* Grid Layout for Form */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                            {/* Full Name */}
                                            <div className="col-span-1 md:col-span-2 group" style={{ animationDelay: '50ms' }}>
                                                <label className={`block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 ${lang === Language.MR ? 'font-marathi' : ''}`}>{t.student_name}</label>
                                                <div className="relative">
                                                    <UserIcon size={18} className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-saffron-500 transition-colors" />
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => {
                                                            setName(e.target.value);
                                                            if (touched.name) validateField('name', e.target.value);
                                                        }}
                                                        onBlur={() => handleBlur('name')}
                                                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all font-medium focus:bg-white focus:ring-2 focus:ring-saffron-500 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                                        placeholder={lang === Language.MR ? "उदा. राहुल पाटील" : "Full Name"}
                                                    />
                                                </div>
                                                {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                                            </div>

                                            {/* Father Name */}
                                            <div className="col-span-1 md:col-span-2 group" style={{ animationDelay: '100ms' }}>
                                                <label className={`block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 ${lang === Language.MR ? 'font-marathi' : ''}`}>{t.father_name}</label>
                                                <div className="relative">
                                                    <UserCheck size={18} className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-saffron-500 transition-colors" />
                                                    <input
                                                        type="text"
                                                        value={fatherName}
                                                        onChange={(e) => {
                                                            setFatherName(e.target.value);
                                                            if (touched.fatherName) validateField('fatherName', e.target.value);
                                                        }}
                                                        onBlur={() => handleBlur('fatherName')}
                                                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all font-medium focus:bg-white focus:ring-2 focus:ring-saffron-500 ${errors.fatherName ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                                        placeholder={lang === Language.MR ? "वडील / आई चे नाव" : "Parent's Name"}
                                                    />
                                                </div>
                                                {errors.fatherName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.fatherName}</p>}
                                            </div>

                                            {/* Date of Birth */}
                                            <div className="group" style={{ animationDelay: '150ms' }}>
                                                <label className={`block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 ${lang === Language.MR ? 'font-marathi' : ''}`}>{t.dob}</label>
                                                <div className="relative">
                                                    <Calendar size={18} className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-saffron-500 transition-colors" />
                                                    <input
                                                        type="date"
                                                        value={dob}
                                                        onChange={(e) => setDob(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-saffron-500 transition-all text-gray-700"
                                                    />
                                                </div>
                                            </div>

                                            {/* Blood Group */}
                                            <div className="group" style={{ animationDelay: '200ms' }}>
                                                <label className={`block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 ${lang === Language.MR ? 'font-marathi' : ''}`}>{t.blood_group}</label>
                                                <div className="relative">
                                                    <Droplet size={18} className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                                                    <select
                                                        value={bloodGroup}
                                                        onChange={(e) => setBloodGroup(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-saffron-500 transition-all text-gray-700 appearance-none"
                                                    >
                                                        <option value="">{t.select_blood_group}</option>
                                                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                                            <option key={bg} value={bg}>{bg}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Mobile */}
                                            <div className="group" style={{ animationDelay: '250ms' }}>
                                                <label className={`block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 ${lang === Language.MR ? 'font-marathi' : ''}`}>{t.mobile_no}</label>
                                                <div className="relative">
                                                    <Smartphone size={18} className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-saffron-500 transition-colors" />
                                                    <input
                                                        type="tel"
                                                        value={mobile}
                                                        onChange={handleMobileChange}
                                                        onBlur={() => handleBlur('mobile')}
                                                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all font-mono text-sm focus:bg-white focus:ring-2 focus:ring-saffron-500 ${errors.mobile ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                                        placeholder="99999 99999"
                                                        maxLength={10}
                                                    />
                                                </div>
                                                {errors.mobile && <p className="text-red-500 text-xs mt-1 ml-1">{errors.mobile}</p>}
                                            </div>

                                            {/* Aadhar */}
                                            <div className="group" style={{ animationDelay: '300ms' }}>
                                                <label className={`block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 ${lang === Language.MR ? 'font-marathi' : ''}`}>{t.aadhar_no}</label>
                                                <div className="relative">
                                                    <CreditCard size={18} className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-saffron-500 transition-colors" />
                                                    <input
                                                        type="text"
                                                        value={aadhar}
                                                        onChange={handleAadharChange}
                                                        onBlur={() => handleBlur('aadhar')}
                                                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all font-mono text-sm focus:bg-white focus:ring-2 focus:ring-saffron-500 ${errors.aadhar ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                                        placeholder="0000 0000 0000"
                                                        maxLength={14}
                                                    />
                                                </div>
                                                {errors.aadhar && <p className="text-red-500 text-xs mt-1 ml-1">{errors.aadhar}</p>}
                                            </div>

                                            {/* Occupation */}
                                            <div className="col-span-1 md:col-span-2 group" style={{ animationDelay: '350ms' }}>
                                                <label className={`block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 ${lang === Language.MR ? 'font-marathi' : ''}`}>{t.occupation}</label>
                                                <div className="relative">
                                                    <Briefcase size={18} className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-saffron-500 transition-colors" />
                                                    <input
                                                        type="text"
                                                        value={occupation}
                                                        onChange={(e) => setOccupation(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all font-medium focus:bg-white focus:ring-2 focus:ring-saffron-500"
                                                        placeholder={lang === Language.MR ? "व्यवसाय / नोकरी" : "Student / Business / Service"}
                                                    />
                                                </div>
                                            </div>

                                            {/* Address */}
                                            <div className="col-span-1 md:col-span-2 group" style={{ animationDelay: '400ms' }}>
                                                <label className={`block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 ${lang === Language.MR ? 'font-marathi' : ''}`}>{t.address}</label>
                                                <div className="relative">
                                                    <MapPin size={18} className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-saffron-500 transition-colors" />
                                                    <textarea
                                                        value={address}
                                                        onChange={(e) => {
                                                            setAddress(e.target.value);
                                                            if (touched.address) validateField('address', e.target.value);
                                                        }}
                                                        onBlur={() => handleBlur('address')}
                                                        rows={2}
                                                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all font-medium resize-none focus:bg-white focus:ring-2 focus:ring-saffron-500 ${errors.address ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                                        placeholder={lang === Language.MR ? "पूर्ण पत्ता" : "Full Residential Address"}
                                                    />
                                                </div>
                                                {errors.address && <p className="text-red-500 text-xs mt-1 ml-1">{errors.address}</p>}
                                            </div>

                                        </div>

                                        {/* Declaration Checkbox */}
                                        <div className={`flex items-start gap-3 p-4 rounded-xl border transition-all hover:shadow-sm ${!agreed && touched.name ? 'border-red-100 bg-red-50/50' : 'border-orange-100 bg-orange-50'}`} style={{ animationDelay: '500ms' }}>
                                            <div className="relative flex items-center pt-0.5">
                                                <input
                                                    type="checkbox"
                                                    id="declaration"
                                                    checked={agreed}
                                                    onChange={(e) => setAgreed(e.target.checked)}
                                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-saffron-300 bg-white checked:bg-saffron-600 checked:border-transparent transition-all"
                                                />
                                                <CheckSquare className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white w-3.5 h-3.5 left-0.5 top-1" />
                                            </div>
                                            <label htmlFor="declaration" className={`text-sm text-gray-700 cursor-pointer leading-snug select-none ${lang === Language.MR ? 'font-marathi' : ''}`}>
                                                {t.declaration}
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isProcessing || Object.keys(errors).length > 0}
                                            className="w-full bg-gradient-to-r from-saffron-600 to-saffron-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus size={20} />
                                                    {t.submit}
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- CHECK STATUS VIEW (NEW) --- */}
                {activeTab === 'status' && (
                    <div className="max-w-2xl mx-auto py-10 px-4">
                        <h2 className={`text-2xl font-bold text-center text-gray-800 mb-8 ${lang === Language.MR ? 'font-marathi' : ''}`}>
                            {t.check_application_status}
                        </h2>

                        {/* Search Box */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (!statusSearchMobile.trim()) return;
                                    setLoading(true);
                                    setStatusSearched(true);
                                    setStatusResult(null);
                                    try {
                                        // Mock Client-side search for now
                                        const res = await api.getStudents(1, 10000, statusSearchMobile, 'all');
                                        // Specific lookup by mobile
                                        const found = res.data.find(s => s.mobileNumber === statusSearchMobile);
                                        if (found) setStatusResult(found);
                                    } catch (err) {
                                        console.error(err);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                            >
                                <label className={`block text-sm font-bold text-gray-500 mb-2 ${lang === Language.MR ? 'font-marathi' : ''}`}>
                                    {t.enter_mobile_search}
                                </label>
                                <div className="flex gap-4">
                                    <div className="relative flex-1">
                                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="tel"
                                            maxLength={10}
                                            value={statusSearchMobile}
                                            onChange={(e) => setStatusSearchMobile(e.target.value.replace(/\D/g, ''))}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-saffron-500 font-mono text-lg tracking-wide"
                                            placeholder="98765 43210"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || statusSearchMobile.length < 10}
                                        className="bg-saffron-600 text-white px-8 rounded-xl font-bold hover:bg-saffron-700 disabled:opacity-50 transition-colors"
                                    >
                                        {loading ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : t.search}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Result Display */}
                        {statusSearched && !loading && (
                            <div className="animate-in slide-in-from-bottom-2 duration-500">
                                {statusResult ? (
                                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                                        <div className={`p-6 text-center text-white ${statusResult.status === 'approved' ? 'bg-green-600' : 'bg-orange-500'}`}>
                                            <div className="w-24 h-24 bg-white rounded-full p-1 mx-auto mb-4 border-4 border-white/30 shadow-sm">
                                                <img src={statusResult.photoUrl} alt="" className="w-full h-full object-cover rounded-full" />
                                            </div>
                                            <h3 className={`text-2xl font-bold mb-1 ${lang === Language.MR ? 'font-marathi' : ''}`}>
                                                {statusResult.name}
                                            </h3>
                                            <p className="opacity-90 font-mono">{statusResult.mobileNumber}</p>
                                        </div>
                                        <div className="p-8 text-center">
                                            {statusResult.status === 'approved' ? (
                                                <div className="bg-green-50 text-green-800 p-6 rounded-xl border border-green-100">
                                                    <h4 className={`text-xl font-bold mb-2 flex items-center justify-center gap-2 ${lang === Language.MR ? 'font-marathi' : ''}`}>
                                                        <CheckCircle size={24} /> {t.status_approved}
                                                    </h4>
                                                    <div className="mt-4">
                                                        <p className="text-sm font-bold text-green-600 uppercase tracking-widest mb-1">{t.your_roll_no}</p>
                                                        <div className="text-4xl font-black font-mono tracking-wider text-green-800">
                                                            {statusResult.rollNumber}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-orange-50 text-orange-800 p-6 rounded-xl border border-orange-100">
                                                    <h4 className={`text-xl font-bold flex items-center justify-center gap-2 ${lang === Language.MR ? 'font-marathi' : ''}`}>
                                                        <Clock size={24} /> {t.status_pending}
                                                    </h4>
                                                    <p className="mt-2 text-orange-700">
                                                        {t.waiting_approval}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                                        <Users className="text-gray-300 mx-auto mb-4" size={48} />
                                        <p className={`text-gray-500 ${lang === Language.MR ? 'font-marathi' : ''}`}>
                                            {t.application_not_found}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentPortal;