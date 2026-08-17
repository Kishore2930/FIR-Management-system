import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "@/react-app/contexts/AuthContext";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/react-app/components/ui/card";
import { Shield } from "lucide-react";

export default function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        badge: "",
        department: "",
        phone: ""
    });
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            // Auto-login after signup
            login({ ...data, ...formData });
            navigate("/");
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4">
            <Card className="w-full max-w-lg shadow-lg border-blue-100">
                <CardHeader className="space-y-1 text-center pb-6">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-600 p-3 rounded-xl shadow-md">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Create an Account</CardTitle>
                    <CardDescription className="text-base mt-2">Register as a new officer in CrimeTrack Pro</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-2">
                            <Input name="name" placeholder="Full Name (e.g., Inspector John Doe)" value={formData.name} onChange={handleChange} required className="h-11 bg-slate-50" />
                        </div>
                        <div className="space-y-2">
                            <Input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="h-11 bg-slate-50" />
                        </div>
                        <div className="space-y-2">
                            <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="h-11 bg-slate-50" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Input name="badge" placeholder="Badge Number" value={formData.badge} onChange={handleChange} className="h-11 bg-slate-50" />
                            </div>
                            <div className="space-y-2">
                                <Input name="department" placeholder="Department" value={formData.department} onChange={handleChange} className="h-11 bg-slate-50" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="h-11 bg-slate-50" />
                        </div>

                        {error && <p className="text-sm text-red-500 text-center font-medium bg-red-50 p-3 rounded-md">{error}</p>}
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base transition-colors mt-2">
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-6 bg-slate-50/50">
                    <p className="text-sm text-muted-foreground">
                        Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
