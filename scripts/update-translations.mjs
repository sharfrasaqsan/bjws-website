import fs from "fs";
import path from "path";

const enContactForm = {
  formTitle: "Send Us a Message",
  formDesc:
    "Submit inquiries, request assistance, or reach out to our executive committee directly.",
  nameLabel: "Full Name",
  emailOptional: "Optional",
  messageLabel: "Your Message or Inquiry",
  consentText:
    "I consent to the Buhary Janaza Welfare Society storing and processing my submitted details strictly for correspondence, in accordance with the",
  privacyLinkText: "Privacy Policy",
  submitButton: "Send Message",
  submittingButton: "Sending...",
  successTitle: "Message Sent Successfully",
  successMessage:
    "Thank you for contacting Buhary Janaza Welfare Society. Your message has been received, and an officer will follow up with you promptly.",
  errorNameMin: "Please enter your name (at least 2 characters).",
  errorNameMax: "Name cannot exceed 100 characters.",
  errorPhoneInvalid:
    "Please provide a valid contact phone number (at least 9 digits).",
  errorEmailInvalid: "Please enter a valid email address.",
  errorMessageMin: "Please enter your message (at least 10 characters).",
  errorMessageMax: "Message cannot exceed 2000 characters.",
  errorConsentRequired: "You must consent to the privacy policy to submit.",
  errorRateLimit:
    "Too many submissions. Please wait a few minutes before trying again.",
  errorDatabaseFailed:
    "Unable to save your message right now. Please call our emergency numbers directly.",
  errorGeneric:
    "An unexpected error occurred. Please try again or call our officers directly.",
};

const enMembership = {
  pageTitle: "Society Membership & Registration",
  breadcrumbs: "Membership",
  subtitle:
    "Join Buhary Janaza Welfare Society as a registered member to support communal welfare, receive funeral aid, and strengthen brotherhood.",
  overviewTitle: "Membership Categories & Contribution",
  overviewText:
    "Registered membership is open to resident Muslim families and individuals of the Buhary Jummah Mosque area in Mullipothanai. Members pool small monthly or annual welfare subscriptions that ensure round-the-clock funeral assistance and emergency relief for every member family.",
  planMonthly: "Monthly Subscription",
  planMonthlyPrice: "LKR 200 / month",
  planMonthlyDesc:
    "Standard family welfare contribution, collected through designated Mahallah area collectors or direct bank transfer.",
  planAnnual: "Annual Subscription",
  planAnnualPrice: "LKR 2,400 / year",
  planAnnualDesc:
    "One-time yearly settlement supporting sustained cemetery maintenance and operational logistics.",
  criteriaTitle: "Eligibility & Community Guidelines",
  criteria1:
    "Open to all Muslim families residing within the Buhary Jummah Mosque Mahallah, Mullipothanai.",
  criteria2:
    "Commitment to mutual social support, communal solidarity, and respectful cooperation.",
  criteria3:
    "Active involvement in voluntary shramadhana cemetery cleanups and community welfare initiatives.",
  formHeading: "Membership Application Form",
  formSubheading:
    "Fill in your details below. An executive committee officer will contact you to verify details and complete enrollment.",
  fullNameLabel: "Full Name (as per NIC / Official Records)",
  phoneLabel: "Primary Contact Number",
  emailLabel: "Email Address",
  emailOptional: "Optional",
  addressLabel: "Residential Address / Area in Mullipothanai",
  familySizeLabel: "Number of Family Members in Household",
  familySizeHint:
    "Helps us coordinate family welfare and funeral coverage records",
  planLabel: "Preferred Contribution Plan",
  preferredContactLabel: "Preferred Method of Communication",
  contactPhone: "Voice Call",
  contactWhatsapp: "WhatsApp",
  contactSms: "SMS Text",
  consentText:
    "I hereby apply for membership in Buhary Janaza Welfare Society, confirm the accuracy of the provided information, and agree to the society rules and",
  privacyLinkText: "Privacy Policy",
  submitButton: "Submit Membership Application",
  submittingButton: "Submitting Application...",
  successTitle: "Application Submitted Successfully",
  successMessage:
    "Alhamdulillah! Your membership application has been received. Our executive committee secretary will contact you shortly to confirm your enrollment.",
  errorNameMin: "Please enter your full name (at least 3 characters).",
  errorNameMax: "Name cannot exceed 120 characters.",
  errorPhoneInvalid:
    "Please provide a valid contact number (at least 9 digits).",
  errorEmailInvalid: "Please enter a valid email address.",
  errorAddressRequired: "Please specify your residential address or area.",
  errorAddressMax: "Address cannot exceed 200 characters.",
  errorFamilySizeMin: "Family size must be at least 1.",
  errorFamilySizeMax: "Please enter a valid family size (max 25).",
  errorConsentRequired:
    "You must accept the terms and privacy policy to apply.",
  errorRateLimit:
    "Too many submissions. Please wait a few minutes before trying again.",
  errorDatabaseFailed:
    "Unable to submit your application right now. Please contact the secretary directly.",
  errorGeneric:
    "An unexpected error occurred. Please try again or contact our officers directly.",
};

const enReports = {
  pageTitle: "Annual Reports & Financial Transparency",
  breadcrumbs: "Reports & Notices",
  eyebrow: "Accountability & Governance",
  subtitle:
    "We uphold transparent, accountable governance with annual audited financial statements and regular community activity reports.",
  transparencyTitle: "Financial Transparency Declaration",
  transparencyBody:
    "As a registered community welfare society (Reg: DS/TH/SS/VSSO/2023/01), all donations, monthly subscriptions, and project expenditures are meticulously audited by community-nominated auditors, approved by the general assembly, and submitted annually to the Divisional Secretariat.",
  reportsListTitle: "Official Annual Reports",
  downloadButton: "Download Document",
  noticesTitle: "Official Community Notices & Announcements",
  noticesEyebrow: "Live Updates",
  noticesSubtitle:
    "Stay informed regarding upcoming shramadhana drives, cemetery works, and general assembly meetings.",
  noticesEmpty: "No active public notices at this moment.",
  noticesBadge: "Official Notice",
};

const enPrivacy = {
  pageTitle: "Privacy Policy & Data Protection",
  breadcrumbs: "Privacy Policy",
  subtitle:
    "How Buhary Janaza Welfare Society collects, safeguards, and uses information provided by community members.",
  section1Title: "1. Purpose of Data Collection",
  section1Body:
    "Buhary Janaza Welfare Society collects personal information strictly for genuine welfare services, including funeral coordination, membership directory records, subscription tracking, and emergency communications. We collect only what is strictly necessary: names, contact phone numbers, residential areas, and household sizes.",
  section2Title: "2. Protection of Personal Data",
  section2Body:
    "We respect your dignity and privacy. Personal details submitted via this website are never sold, traded, or shared with commercial entities or unauthorized third parties. Access to member records is restricted strictly to authorized executive committee officers (President, Secretary, and Treasurer).",
  section3Title: "3. Photographic & Media Consent",
  section3Body:
    "Photographs published on this website document public community activities (e.g. shramadhana cleanups, humanitarian distributions). In accordance with society guidelines, photos highlighting identifiable community members, women, or minors require explicit consent and administrative verification prior to publication.",
  section4Title: "4. Contact Regarding Your Data",
  section4Body:
    "You have the right to request access to your submitted details, request corrections, or request removal from our contact lists. For any inquiries regarding data protection, please contact the society secretary at mbjwsociety@gmail.com or visit the society office at the 95th Buhary Jummah Mosque, Mullipothanai.",
};

// ======================== TAMIL ========================
const taContactForm = {
  formTitle: "எமக்கு செய்தி அனுப்புங்கள்",
  formDesc:
    "உங்கள் விசாரணைகளை சமர்ப்பிக்கவும், உதவிகளைப் பெறவும், அல்லது நிர்வாக சபை உறுப்பினர்களை நேரடியாகத் தொடர்பு கொள்ளவும்.",
  nameLabel: "முழுப் பெயர்",
  emailOptional: "விருப்பத்தேர்வு",
  messageLabel: "உங்கள் செய்தி அல்லது விசாரணை",
  consentText:
    "புகாரி ஜனாஸா நலன்புரிச் சங்கம் எனது தொடர்புத் தகவல்களைத் தொடர்பாடல் நோக்கங்களுக்காகச் சேமித்து வைத்திருக்க உடன்படுகிறேன். இது எமது",
  privacyLinkText: "தனியுரிமைக் கொள்கைக்கு",
  submitButton: "செய்தியை அனுப்பவும்",
  submittingButton: "அனுப்பப்படுகிறது...",
  successTitle: "செய்தி வெற்றிகரமாக அனுப்பப்பட்டது",
  successMessage:
    "புகாரி ஜனாஸா நலன்புரிச் சங்கத்தைத் தொடர்பு கொண்டமைக்கு நன்றி. உங்கள் செய்தி கிடைக்கப்பெற்றுள்ளது, நிர்வாக அதிகாரி ஒருவர் விரைவில் உங்களைத் தொடர்பு கொள்வார்.",
  errorNameMin:
    "தயவுசெய்து உங்கள் பெயரை உள்ளிடவும் (குறைந்தது 2 எழுத்துக்கள்).",
  errorNameMax: "பெயர் 100 எழுத்துக்களுக்கு மிகாமல் இருக்க வேண்டும்.",
  errorPhoneInvalid:
    "சரியான தொடர்பு இலக்கத்தை உள்ளிடவும் (குறைந்தது 9 இலக்கங்கள்).",
  errorEmailInvalid: "செல்லுபடியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
  errorMessageMin:
    "தயவுசெய்து உங்கள் செய்தியை உள்ளிடவும் (குறைந்தது 10 எழுத்துக்கள்).",
  errorMessageMax: "செய்தி 2000 எழுத்துக்களுக்கு மிகாமல் இருக்க வேண்டும்.",
  errorConsentRequired:
    "சமர்ப்பிக்க தனியுரிமைக் கொள்கையை ஏற்றுக்கொள்ள வேண்டும்.",
  errorRateLimit:
    "அதிகப்படியான சமர்ப்பிப்புகள். தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.",
  errorDatabaseFailed:
    "செய்தியைச் சேமிக்க முடியவில்லை. தயவுசெய்து எமது அவசர தொலைபேசி இலக்கங்களை நேரடியாகத் தொடர்பு கொள்ளவும்.",
  errorGeneric:
    "எதிர்பாராத பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும் அல்லது நேரடியாக அழைக்கவும்.",
};

const taMembership = {
  pageTitle: "சங்க அங்கத்துவம் மற்றும் பதிவு",
  breadcrumbs: "அங்கத்துவம்",
  subtitle:
    "புகாரி ஜனாஸா நலன்புரிச் சங்கத்தில் உறுப்பினராக இணைந்து சமூக நலனுக்கும் ஜனாஸா உதவிக்கும் கைகோருங்கள்.",
  overviewTitle: "அங்கத்துவ பிரிவுகளும் பங்களிப்பும்",
  overviewText:
    "முள்ளிப்பொத்தானை புகாரி ஜும்ஆ பள்ளிவாசல் மஹல்லா வாழ் முஸ்லிம் குடும்பங்களுக்கும் தனிநபர்களுக்கும் அங்கத்துவம் திறக்கப்பட்டுள்ளது. உறுப்பினர்களின் மாதாந்த அல்லது வருடாந்த சந்தா மூலம் முழு நேர ஜனாஸா சேவைகள் மற்றும் அவசர உதவிகள் உறுதிப்படுத்தப்படுகின்றன.",
  planMonthly: "மாதாந்த சந்தா",
  planMonthlyPrice: "ரூ. 200 / மாதம்",
  planMonthlyDesc:
    "மஹல்லா பகுதி வசூலிப்பாளர்கள் ஊடாக அல்லது நேரடி வங்கி வைப்பு மூலம் செலுத்தப்படும் குடும்ப நலன்புரிப் பங்களிப்பு.",
  planAnnual: "வருடாந்த சந்தா",
  planAnnualPrice: "ரூ. 2,400 / வருடம்",
  planAnnualDesc:
    "மையவாடி பராமரிப்பு மற்றும் சங்க செயற்பாடுகளுக்கான ஒரு முறை வருடாந்த கொடுப்பனவு.",
  criteriaTitle: "தகுதி மற்றும் வழிகாட்டல்கள்",
  criteria1:
    "முள்ளிப்பொத்தானை புகாரி ஜும்ஆ பள்ளிவாசல் மஹல்லா எல்லைக்குள் வசிக்கும் அனைத்து முஸ்லிம் குடும்பங்களுக்கும் திறக்கப்பட்டுள்ளது.",
  criteria2:
    "பரஸ்பர சகோதரத்துவம், சமூக ஒற்றுமை மற்றும் பரஸ்பர ஒத்துழைப்புக்கான அர்ப்பணிப்பு.",
  criteria3:
    "மையவாடி சிரமதானப் பணிகள் மற்றும் நலன்புரி செயற்பாடுகளில் தன்னார்வமாகப் பங்கெடுத்தல்.",
  formHeading: "அங்கத்துவ விண்ணப்பப் படிவம்",
  formSubheading:
    "கீழே உங்கள் விபரங்களை உள்ளிடவும். எமது நிர்வாக அதிகாரி உங்களைத் தொடர்பு கொண்டு விபரங்களை உறுதிப்படுத்துவார்.",
  fullNameLabel: "முழுப் பெயர் (அடையாள அட்டை / உத்தியோகபூர்வ ஆவணங்களின்படி)",
  phoneLabel: "முதன்மைத் தொடர்பு இலக்கம்",
  emailLabel: "மின்னஞ்சல் முகவரி",
  emailOptional: "விருப்பத்தேர்வு",
  addressLabel: "வதிவிட முகவரி / முள்ளிப்பொத்தானை பகுதி",
  familySizeLabel: "குடும்ப உறுப்பினர்களின் எண்ணிக்கை",
  familySizeHint:
    "குடும்ப நலன்புரி மற்றும் ஜனாஸா உதவிப் பதிவுகளுக்கு உதவுகிறது",
  planLabel: "விரும்பும் சந்தா முறை",
  preferredContactLabel: "தொடர்பு கொள்ள விரும்பும் முறை",
  contactPhone: "தொலைபேசி அழைப்பு",
  contactWhatsapp: "வாட்ஸ்அப் (WhatsApp)",
  contactSms: "குறுஞ்செய்தி (SMS)",
  consentText:
    "புகாரி ஜனாஸா நலன்புரிச் சங்கத்தின் அங்கத்துவத்திற்கு விண்ணப்பிப்பதுடன், வழங்கப்பட்ட தகவல்கள் சரியானவை எனவும் சங்க விதிமுறைகளுக்கும்",
  privacyLinkText: "தனியுரிமைக் கொள்கைக்கும்",
  submitButton: "அங்கத்துவ விண்ணப்பத்தை சமர்ப்பிக்கவும்",
  submittingButton: "சமர்ப்பிக்கப்படுகிறது...",
  successTitle: "விண்ணப்பம் வெற்றிகரமாகச் சமர்ப்பிக்கப்பட்டது",
  successMessage:
    "அல்ஹம்துலில்லாஹ்! உங்கள் அங்கத்துவ விண்ணப்பம் கிடைக்கப்பெற்றுள்ளது. எமது செயலாளர் விரைவில் உங்களைத் தொடர்பு கொண்டு அங்கத்துவத்தை உறுதிப்படுத்துவார்.",
  errorNameMin:
    "தயவுசெய்து உங்கள் முழுப் பெயரை உள்ளிடவும் (குறைந்தது 3 எழுத்துக்கள்).",
  errorNameMax: "பெயர் 120 எழுத்துக்களுக்கு மிகாமல் இருக்க வேண்டும்.",
  errorPhoneInvalid:
    "சரியான தொடர்பு இலக்கத்தை உள்ளிடவும் (குறைந்தது 9 இலக்கங்கள்).",
  errorEmailInvalid: "செல்லுபடியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
  errorAddressRequired: "உங்கள் வதிவிட முகவரியை அல்லது பகுதியை உள்ளிடவும்.",
  errorAddressMax: "முகவரி 200 எழுத்துக்களுக்கு மிகாமல் இருக்க வேண்டும்.",
  errorFamilySizeMin:
    "குடும்ப உறுப்பினர் எண்ணிக்கை குறைந்தது 1 ஆக இருக்க வேண்டும்.",
  errorFamilySizeMax: "சரியான எண்ணிக்கையை உள்ளிடவும் (அதிகபட்சம் 25).",
  errorConsentRequired:
    "விண்ணப்பிக்க தனியுரிமைக் கொள்கையை ஏற்றுக்கொள்ள வேண்டும்.",
  errorRateLimit:
    "அதிகப்படியான சமர்ப்பிப்புகள். தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.",
  errorDatabaseFailed:
    "விண்ணப்பத்தைச் சமர்ப்பிக்க முடியவில்லை. செயலாளரை நேரடியாகத் தொடர்பு கொள்ளவும்.",
  errorGeneric:
    "எதிர்பாராத பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும் அல்லது நேரடியாக அழைக்கவும்.",
};

const taReports = {
  pageTitle: "வருடாந்த அறிக்கைகளும் நிதி வெளிப்படைத்தன்மையும்",
  breadcrumbs: "அறிக்கைகளும் அறிவித்தல்களும்",
  eyebrow: "பொறுப்புக்கூறல் & நிர்வாகம்",
  subtitle:
    "கணக்காய்வு செய்யப்பட்ட வருடாந்த நிதி அறிக்கைகள் மற்றும் சமூக செயற்பாட்டு அறிக்கைகள் ஊடாக நாம் வெளிப்படையான நிர்வாகத்தைப் பேணுகின்றோம்.",
  transparencyTitle: "நிதி வெளிப்படைத்தன்மைப் பிரகடனம்",
  transparencyBody:
    "பதிவுசெய்யப்பட்ட சமூக நலன்புரி அமைப்பாக (பதிவு இல: DS/TH/SS/VSSO/2023/01), சங்கத்தின் அனைத்து நன்கொடைகள், மாதாந்த சந்தாக்கள் மற்றும் செலவீனங்கள் பொதுச்சபையினால் நியமிக்கப்பட்ட கணக்காய்வாளர்களால் பரிசீலிக்கப்பட்டு, பொதுக்கூட்டத்தில் அங்கீகரிக்கப்பட்டு பிரதேச செயலகத்திற்குச் சமர்ப்பிக்கப்படுகின்றன.",
  reportsListTitle: "உத்தியோகபூர்வ வருடாந்த அறிக்கைகள்",
  downloadButton: "ஆவணத்தைப் பதிவிறக்கவும்",
  noticesTitle: "சமூக உத்தியோகபூர்வ அறிவித்தல்கள்",
  noticesEyebrow: "தற்போதைய செய்திகள்",
  noticesSubtitle:
    "வரவிருக்கும் சிரமதானப் பணிகள், மையவாடி அபிவிருத்திகள் மற்றும் பொதுக்கூட்டங்கள் பற்றிய விபரங்கள்.",
  noticesEmpty: "தற்போது பொது அறிவித்தல்கள் எதுவும் இல்லை.",
  noticesBadge: "உத்தியோகபூர்வ அறிவித்தல்",
};

const taPrivacy = {
  pageTitle: "தனியுரிமைக் கொள்கை மற்றும் தரவுப் பாதுகாப்பு",
  breadcrumbs: "தனியுரிமைக் கொள்கை",
  subtitle:
    "புகாரி ஜனாஸா நலன்புரிச் சங்கம் சமூக உறுப்பினர்களின் தகவல்களை எவ்வாறு பாதுகாப்பாகக் கையாள்கிறது என்ற விபரம்.",
  section1Title: "1. தரவு சேகரிப்பின் நோக்கம்",
  section1Body:
    "ஜனாஸா சேவைகள் ஒருங்கிணைப்பு, அங்கத்துவப் பதிவேடு, சந்தா விபரங்கள் மற்றும் அவசர தொடர்பாடல்களுக்காக மட்டுமே தகவல்கள் சேகரிக்கப்படுகின்றன. பெயர், தொலைபேசி இலக்கம், வசிப்பிடம் போன்ற அத்தியாவசிய விபரங்கள் மட்டுமே பெறப்படுகின்றன.",
  section2Title: "2. தனிப்பட்ட தரவுப் பாதுகாப்பு",
  section2Body:
    "உறுப்பினர்களின் தகவல்கள் எந்தவொரு வணிக நோக்கங்களுக்காகவோ அல்லது மூன்றாம் தரப்பினருக்கோ பகிரப்பட மாட்டாது. உத்தியோகபூர்வ நிர்வாக சபை அதிகாரிகளுக்கு மட்டுமே இத்தரவுகளைப் பார்வையிட அனுமதியுண்டு.",
  section3Title: "3. புகைப்பட மற்றும் ஊடக அனுமதி",
  section3Body:
    "பொது சிரமதானப் பணிகள், நிவாரண விநியோகங்கள் போன்ற சமூக செயற்பாடுகள் ஆவணப்படுத்தப்பட்டு வெளியிடப்படுகின்றன. அடையாளம் காணக்கூடிய தனிநபர்கள், பெண்கள் அல்லது சிறுவர்களின் புகைப்படங்கள் உரிய அனுமதியுடன் மட்டுமே வெளியிடப்படுகின்றன.",
  section4Title: "4. உங்கள் தரவுகள் தொடர்பான தொடர்பாடல்",
  section4Body:
    "உங்கள் விபரங்களைச் சரிபார்க்கவோ அல்லது திருத்தவோ விரும்பினால், சங்கச் செயலாளரை mbjwsociety@gmail.com ஊடாக அல்லது 95 ஆம் கட்டை புகாரி ஜும்ஆ பள்ளிவாசல் அலுவலகத்தில் நேரடியாகத் தொடர்பு கொள்ளலாம்.",
};

// ======================== SINHALA (with [TODO-TRANSLATE]) ========================
function makeSinhala(obj) {
  const res = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "object" && v !== null) {
      res[k] = makeSinhala(v);
    } else {
      res[k] = `[TODO-TRANSLATE] ${v}`;
    }
  }
  return res;
}

const basePath = path.join(process.cwd(), "bjws-website/src/i18n/messages");

// Update en.json
const enPath = path.join(basePath, "en.json");
const en = JSON.parse(fs.readFileSync(enPath, "utf-8"));
en.contactPage = { ...en.contactPage, ...enContactForm };
en.membershipPage = enMembership;
en.reportsPage = enReports;
en.privacyPage = enPrivacy;
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), "utf-8");
console.log("Updated en.json");

// Update ta.json
const taPath = path.join(basePath, "ta.json");
const ta = JSON.parse(fs.readFileSync(taPath, "utf-8"));
ta.contactPage = { ...ta.contactPage, ...taContactForm };
ta.membershipPage = taMembership;
ta.reportsPage = taReports;
ta.privacyPage = taPrivacy;
fs.writeFileSync(taPath, JSON.stringify(ta, null, 2), "utf-8");
console.log("Updated ta.json");

// Update si.json
const siPath = path.join(basePath, "si.json");
const si = JSON.parse(fs.readFileSync(siPath, "utf-8"));
si.contactPage = { ...si.contactPage, ...makeSinhala(enContactForm) };
si.membershipPage = makeSinhala(enMembership);
si.reportsPage = makeSinhala(enReports);
si.privacyPage = makeSinhala(enPrivacy);
fs.writeFileSync(siPath, JSON.stringify(si, null, 2), "utf-8");
console.log("Updated si.json");
