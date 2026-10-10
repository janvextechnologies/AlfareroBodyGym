import type { Metadata } from "next";
import { getSettings } from "@/server/data/settings";
import { AdminCard, PageHeader } from "@/components/admin/PageHeader";
import { ContactForm } from "@/components/admin/ContactForm";

export const metadata: Metadata = {
  title: "Contacto y redes",
  robots: { index: false, follow: false },
};

export default async function ContactoPage() {
  const settings = await getSettings();

  return (
    <div>
      <PageHeader
        title="Contacto y redes sociales"
        description="Teléfono, WhatsApp, correo y redes sociales del gimnasio."
      />
      <AdminCard>
        <ContactForm
          initial={{
            contactPhone: settings.contactPhone,
            contactWhatsapp: settings.contactWhatsapp,
            contactEmail: settings.contactEmail,
            socials: settings.socials.map((social) => ({
              label: social.label,
              href: social.href,
              icon: social.icon,
            })),
          }}
        />
      </AdminCard>
    </div>
  );
}
