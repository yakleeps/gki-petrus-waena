import { WorshipSchedule } from '../types';

export function formatWorshipWAMessage(schedule: WorshipSchedule, userSector?: string): string {
  const dateFormatted = schedule.dateOrDay;
  const locationFormatted = schedule.location;

  return encodeURIComponent(
`*PENGINGAT KEGIATAN IBADAH GKI PETRUS WAENA* ⛪🕊️
_Klasis Port Numbay / Jayapura, Tanah Papua_

Shalom Bpk/Ibu/Sdr/i terkasih dalam Kristus,
Berikut adalah informasi & pengingat jadwal ibadah mendatang:

📌 *Kegiatan*: ${schedule.title} (${schedule.categoryLabel})
🗓️ *Hari/Tgl*: ${dateFormatted}
⏰ *Waktu*: ${schedule.time}
📍 *Tempat*: ${locationFormatted}

📖 *Tema*: "${schedule.theme}"
📜 *Nats Alkitab*: ${schedule.bibleVerse}
🎤 *Pelayan Firman*: ${schedule.preacher}
📋 *Liturgos*: ${schedule.liturgist}
${schedule.organist ? `🎹 *Pemusik*: ${schedule.organist}\n` : ''}${schedule.kantor ? `🎶 *Paduan Suara/Koor*: ${schedule.kantor}\n` : ''}
${schedule.onlineStreamUrl ? `🔴 *Live Streaming*: ${schedule.onlineStreamUrl}\n` : ''}
Mari hadir bersama keluarga untuk memuji dan memuliakan nama Tuhan. Tuhan Yesus memberkati kita sekalian!

_Sekretariat & Majelis Jemaat GKI Petrus Waena_
Website Resmi: https://gkipetruswaena.or.id`
  );
}

export function openWhatsAppDirect(phone: string, text: string) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const url = cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=${text}`
    : `https://wa.me/?text=${text}`;
  window.open(url, '_blank');
}

export function shareToWhatsAppGroup(text: string) {
  const url = `https://api.whatsapp.com/send?text=${text}`;
  window.open(url, '_blank');
}
