
import StudentIdCard from "@/components/features/StudentIdCard";

export default function ProfilePage() {
    return (
        <div className="p-6 pt-12 pb-32 flex flex-col items-center">
            <header className="mb-8 w-full max-w-sm">
                <h1 className="text-3xl font-serif text-blud-blue italic tracking-tight">Your ID</h1>
            </header>

            <StudentIdCard />

            <div className="mt-8 text-center">
                <p className="text-xs text-blud-blue/40 font-mono uppercase tracking-widest">
                    Blud University • Fall Semester 2026
                </p>
            </div>
        </div>
    );
}
