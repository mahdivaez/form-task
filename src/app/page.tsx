"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PersianDatePicker } from "@/components/persian-date-picker";
import { FileUpload } from "@/components/file-upload";
import { Confetti } from "@/components/confetti";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Send } from "lucide-react";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/lib/use-toast";
import type { FormData } from "@/types/form";

// Define validation schema
const formSchema = z.object({
    fullName: z.string().min(3, "نام و نام خانوادگی باید حداقل 3 کاراکتر باشد"),
    phoneNumber: z
        .string()
        .regex(/^09\d{9}$/, "شماره تلفن باید معتبر و با 09 شروع شود"),
    email: z.string().email("ایمیل معتبر نیست"),
    birthDate: z.string().min(1, "تاریخ تولد الزامی است"),
    gender: z.string().min(1, "جنسیت الزامی است"),
    militaryStatus: z.string().min(1, "وضعیت نظام وظیفه الزامی است"),
    resume: z.any().refine((file) => file !== null, "آپلود رزومه الزامی است"),
});

export default function JobApplicationForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isFormComplete, setIsFormComplete] = useState(false);
    const { toast } = useToast();
    
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            toast({
                variant: "destructive",
                title: "خطا در فرم",
                description: "لطفاً اطلاعات وارد شده را بررسی کنید.",
            });
        }
    }, [errors, toast]);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            console.log("Form Data:", data);
            setShowConfetti(true);
            setIsFormComplete(true);
            toast({
                title: "فرم با موفقیت ارسال شد",
                description: "اطلاعات شما با موفقیت ثبت شد.",
            });
            setTimeout(() => setShowConfetti(false), 5000);
        } catch {
            toast({
                variant: "destructive",
                title: "خطا در ارسال فرم",
                description: "لطفاً دوباره تلاش کنید.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const formFields = [
        {
            name: "fullName",
            label: "نام و نام خانوادگی",
            placeholder: "مثال: علی محمدی",
        },
        {
            name: "phoneNumber",
            label: "شماره تلفن",
            placeholder: "مثال: 09123456789",
        },
        {
            name: "email",
            label: "ایمیل",
            placeholder: "مثال: example@email.com",
            type: "email",
        },
        {
            name: "birthDate",
            label: "تاریخ تولد",
            component: PersianDatePicker,
        },
        {
            name: "gender",
            label: "جنسیت",
            component: Select,
            options: [
                { value: "male", label: "مرد" },
                { value: "female", label: "زن" },
            ],
        },
        {
            name: "militaryStatus",
            label: "وضعیت نظام وظیفه",
            component: Select,
            options: [
                { value: "educational", label: "معافیت تحصیلی" },
                { value: "ongoing", label: "در حال انجام" },
                { value: "subject", label: "مشمول" },
                { value: "exempt", label: "معاف دائم" },
            ],
        },
        {
            name: "resume",
            label: "رزومه",
            component: FileUpload,
        },
    ];

    return (
        <ToastProvider>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8 rtl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <AnimatePresence>
                        {!isFormComplete && (
                            <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex justify-between items-center mb-8">
                                        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                                            <Sparkles className="mr-2 text-purple-500" />
                                            فرم درخواست
                                        </h1>
                                        <Button
                                            variant="outline"
                                            className="text-red-500 rounded-full border-red-500 hover:bg-red-50 hover:text-red-500"
                                        >
                                            لغو درخواست
                                        </Button>
                                    </div>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 text-right gap-6">
                                            {formFields.slice(0, 6).map((field, index) => (
                                                <motion.div
                                                    key={field.name}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="space-y-2 text-black text-right"
                                                >
                                                    <label className="text-sm font-medium text-gray-700">
                                                        {field.label}
                                                    </label>
                                                    {field.component ? (
                                                        field.component === Select ? (
                                                            <Select
                                                                onValueChange={(value) =>
                                                                    setValue(field.name as keyof FormData, value)
                                                                }
                                                            >
                                                                <SelectTrigger
                                                                    className={`bg-white rounded-full ${
                                                                        errors[field.name as keyof FormData]
                                                                            ? 'border-red-500'
                                                                            : ''
                                                                    }`}
                                                                >
                                                                    <SelectValue
                                                                        className="bg-white"
                                                                        placeholder={`انتخاب ${field.label}`}
                                                                    />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-white z-50 shadow-lg">
                                                                    {field.options?.map((option) => (
                                                                        <SelectItem
                                                                            key={option.value}
                                                                            value={option.value}
                                                                            className="bg-white hover:bg-gray-100"
                                                                        >
                                                                            {option.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        ) : field.component === PersianDatePicker ? (
                                                            <PersianDatePicker
                                                                value={watch(field.name as keyof FormData) as string}
                                                                onChange={(date) =>
                                                                    setValue(field.name as keyof FormData, date)
                                                                }
                                                                error={errors[field.name as keyof FormData]?.message}
                                                            />
                                                        ) : null
                                                    ) : (
                                                        <Input
                                                            {...register(field.name as keyof FormData)}
                                                            placeholder={field.placeholder}
                                                            type={field.type || 'text'}
                                                            className={`bg-white rounded-full ${
                                                                errors[field.name as keyof FormData]
                                                                    ? 'border-red-500'
                                                                    : ''
                                                            }`}
                                                        />
                                                    )}
                                                    {errors[field.name as keyof FormData] && (
                                                        <p className="text-sm text-red-500">
                                                            {errors[field.name as keyof FormData]?.message}
                                                        </p>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                            className="space-y-2"
                                        >
                                            <label className="text-sm font-medium text-gray-700">
                                                {formFields[6].label}
                                            </label>
                                            <FileUpload
                                                onFileSelect={(file) =>
                                                    setValue('resume' as keyof FormData, file)
                                                }
                                                selectedFile={watch('resume' as keyof FormData) as File | null}
                                                error={errors.resume?.message}
                                            />
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:bg-purple-700 text-white font-bold py-3 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    'در حال ارسال...'
                                                ) : (
                                                    <span className="flex items-center justify-center">
                                                        <Send className="mr-2" size={18} />
                                                        ثبت رزومه
                                                    </span>
                                                )}
                                            </Button>
                                        </motion.div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                        {isFormComplete && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-2xl max-w-md mx-auto mt-20"
                            >
                                {showConfetti && <Confetti />}
                                <div className="bg-green-100 p-4 rounded-full mb-6">
                                    <Sparkles className="text-green-500 w-12 h-12" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-4"> فرم شما با موفقیت ارسال شد! </h2>
                                <p className="text-gray-600 mb-8"> اطلاعات شما بررسی خواهد شد و به زودی با شما تماس خواهیم گرفت. </p>
                                <Button
                                    className="mt-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:bg-purple-700 text-white font-bold py-3 px-6 transition duration-300 ease-in-out transform hover:-translate-y-1"
                                    onClick={() => setIsFormComplete(false)}
                                >
                                    ارسال فرم جدید
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                <ToastViewport />
            </div>
        </ToastProvider>
    );
}