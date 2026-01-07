import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.role || 'user',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    return (
        <DashboardLayout title="Edit Pengguna">
            <Head title="Edit Pengguna" />

            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <Link
                                href={route('admin.users.index')}
                                className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-2 group"
                            >
                                <svg className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Kembali ke Daftar
                            </Link>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Pengguna</h1>
                            <p className="mt-2 text-sm text-slate-600">
                                Perbarui informasi dan hak akses pengguna <strong>{user.name}</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                                    {/* Name */}
                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="name" value="Nama Lengkap" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            className="mt-1 block w-full rounded-xl border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            autoFocus
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    {/* Email */}
                                    <div className="sm:col-span-1">
                                        <InputLabel htmlFor="email" value="Alamat Email" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full rounded-xl border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    {/* Role */}
                                    <div className="sm:col-span-1">
                                        <InputLabel htmlFor="role" value="Role Pengguna" />
                                        <div className="relative mt-1">
                                            <select
                                                id="role"
                                                className="block w-full rounded-xl border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm appearance-none bg-white py-2 pl-3 pr-10 text-base focus:outline-none sm:text-sm"
                                                value={data.role}
                                                onChange={(e) => setData('role', e.target.value)}
                                                required
                                            >
                                                <option value="user">User</option>
                                                <option value="trainer">Trainer</option>
                                                <option value="super_admin">Super Admin</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <InputError message={errors.role} className="mt-2" />
                                    </div>
                                </div>

                                {/* Password Section */}
                                <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50/50 rounded-xl p-6 -mx-2">
                                    <div className="mb-4">
                                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Ubah Password</h3>
                                        <p className="text-xs text-slate-500">
                                            Biarkan kosong jika tidak ingin mengubah password saat ini.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                                        <div>
                                            <InputLabel htmlFor="password" value="Password Baru" />
                                            <TextInput
                                                id="password"
                                                type="password"
                                                className="mt-1 block w-full rounded-xl border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Biarkan kosong untuk tetap"
                                            />
                                            <InputError message={errors.password} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password Baru" />
                                            <TextInput
                                                id="password_confirmation"
                                                type="password"
                                                className="mt-1 block w-full rounded-xl border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Ulangi password baru"
                                            />
                                            <InputError message={errors.password_confirmation} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
                                    <Link
                                        href={route('admin.users.index')}
                                        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50"
                                    >
                                        Batal
                                    </Link>
                                    <PrimaryButton disabled={processing} className="rounded-xl px-6 py-2.5 shadow-lg shadow-indigo-500/20">
                                        {processing ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Menyimpan...
                                            </span>
                                        ) : 'Update User'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
