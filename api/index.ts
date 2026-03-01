import { Student } from '../types';

export const api = {
    getStudents: async (page: number, limit: number, search: string, status: 'approved' | 'pending' | 'all') => {
        try {
            const response = await fetch('/api/students');
            const contentType = response.headers.get("content-type");
            if (!response.ok || !contentType || !contentType.includes("application/json")) {
                console.warn("API returned non-JSON or error. This is expected in local development.");
                return { data: [], total: 0, totalPages: 0 };
            }
            const allStudents: Student[] = await response.json();

            let filtered = status === 'all' ? allStudents : allStudents.filter(s => s.status === status);

            if (search) {
                const lowerSearch = search.toLowerCase();
                filtered = filtered.filter(s =>
                    s.name.toLowerCase().includes(lowerSearch) ||
                    s.rollNumber.toLowerCase().includes(lowerSearch) ||
                    s.mobileNumber.includes(search)
                );
            }

            const start = (page - 1) * limit;
            const end = start + limit;
            const data = filtered.slice(start, end);

            return {
                data,
                total: filtered.length,
                totalPages: Math.ceil(filtered.length / limit)
            };
        } catch (error) {
            console.error(error);
            return { data: [], total: 0, totalPages: 0 };
        }
    },

    addStudent: async (student: Omit<Student, 'id'>) => {
        const newStudent = { ...student, id: Date.now() };
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        });
        if (!response.ok) throw new Error('Failed to add student');
        return newStudent;
    },

    updateStudent: async (id: number, updates: Partial<Student>) => {
        const response = await fetch('/api/students', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...updates })
        });
        if (!response.ok) throw new Error('Failed to update student');
        return { id, ...updates };
    },

    deleteStudent: async (id: number) => {
        const response = await fetch(`/api/students?id=${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete student');
        return true;
    }
};
