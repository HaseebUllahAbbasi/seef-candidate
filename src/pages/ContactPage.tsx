import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PublicLayout from '../components/PublicLayout';
import { FormField, inputClass, btnPrimary } from '../components/ui';
import { SEEF } from '../lib/seefContent';
import { cnicFieldSchema, mobileFieldSchema, optionalCnicFieldSchema } from '../lib/pakistanIdFormat';
import { cnicInputProps, mobileInputProps } from '../lib/formattedIdFields';

const contactSchema = z.object({
  type: z.enum(['complaint', 'inquiry', 'feedback', 'technical']),
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  mobile: mobileFieldSchema,
  cnic: optionalCnicFieldSchema,
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Please provide details (min 20 characters)'),
});

type ContactForm = z.infer<typeof contactSchema>;

const TYPE_LABELS: Record<ContactForm['type'], string> = {
  complaint: 'Complaint',
  inquiry: 'General Inquiry',
  feedback: 'Feedback',
  technical: 'Technical Issue (Portal)',
};

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { type: 'inquiry' },
    mode: 'onBlur',
  });

  const onSubmit = async (data: ContactForm) => {
    // Demo: persist locally; production would POST to SEEF backend
    const tickets = JSON.parse(localStorage.getItem('seef_contact_tickets') || '[]');
    tickets.push({ ...data, id: `TKT-${Date.now()}`, createdAt: new Date().toISOString() });
    localStorage.setItem('seef_contact_tickets', JSON.stringify(tickets));
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    reset();
  };

  return (
    <PublicLayout>
      <div className="bg-gradient-to-b from-slate-100 to-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-5 gap-10">
          {/* Info panel */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
              <p className="text-slate-500 mt-2">
                Submit a complaint, inquiry, or feedback regarding SEEF scholarships and this portal.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <h2 className="font-semibold text-slate-900">SEEF Secretariat</h2>
              <div className="space-y-3 text-sm text-slate-600">
                <p className="flex gap-3">
                  <span className="text-emerald-600">📍</span>
                  {SEEF.address}
                </p>
                <p className="flex gap-3">
                  <span className="text-emerald-600">✉️</span>
                  <a href={`mailto:${SEEF.email}`} className="text-emerald-700 hover:underline">{SEEF.email}</a>
                </p>
                <p className="flex gap-3">
                  <span className="text-emerald-600">📞</span>
                  {SEEF.phone}
                </p>
                <p className="flex gap-3">
                  <span className="text-emerald-600">🌐</span>
                  <a href={SEEF.website} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">seef.sindh.gov.pk</a>
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
              <p className="font-semibold mb-1">For application status</p>
              <p>Login to your candidate account to track applications. For urgent scholarship complaints, select &quot;Complaint&quot; and include your application reference if available.</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-white rounded-2xl border border-emerald-200 p-10 text-center shadow-sm">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Message Received</h2>
                <p className="text-slate-500 mt-2">Thank you for contacting SEEF. Our team will respond within 5–7 working days.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-emerald-700 font-medium hover:underline">
                  Submit another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Send a Message</h2>

                <FormField label="Message Type" error={errors.type} required>
                  <select {...register('type')} className={inputClass(!!errors.type)}>
                    {Object.entries(TYPE_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </FormField>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField label="Full Name" error={errors.fullName} required>
                    <input {...register('fullName')} className={inputClass(!!errors.fullName)} />
                  </FormField>
                  <FormField label="CNIC (optional)" error={errors.cnic} hint="Format: XXXXX-XXXXXXX-X">
                    <input {...cnicInputProps(register, setValue, 'cnic')} className={inputClass(!!errors.cnic)} />
                  </FormField>
                  <FormField label="Email" error={errors.email} required>
                    <input type="email" {...register('email')} className={inputClass(!!errors.email)} />
                  </FormField>
                  <FormField label="Mobile" error={errors.mobile} required hint="Format: 03XX-XXXXXXX">
                    <input {...mobileInputProps(register, setValue, 'mobile')} className={inputClass(!!errors.mobile)} />
                  </FormField>
                </div>

                <FormField label="Subject" error={errors.subject} required>
                  <input {...register('subject')} className={inputClass(!!errors.subject)} placeholder="Brief summary of your message" />
                </FormField>

                <FormField label="Message" error={errors.message} required>
                  <textarea {...register('message')} rows={5} className={inputClass(!!errors.message)} placeholder="Describe your complaint or inquiry in detail..." />
                </FormField>

                <button type="submit" disabled={isSubmitting} className={`${btnPrimary(isSubmitting)} w-full md:w-auto px-8`}>
                  {isSubmitting ? 'Sending...' : 'Submit Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
