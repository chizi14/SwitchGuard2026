export const faqEntries = [
  {
    id: "dispense-error",
    keywords: ["dispense", "error", "atm", "took", "money", "cash", "didn't give", "no cash", "failed withdrawal", "deducted"],
    en: {
      q: "What is a dispense error?",
      a: "A dispense error happens when an ATM deducts money from your account but fails to physically release the cash. It's usually a machine fault — not something you did wrong. SwitchGuard detects these automatically and starts the reversal process.",
    },
    ch: {
      q: "Ndi chiyani dispense error?",
      a: "Dispense error ndi chinthu chomwe chimachitika poti ATM yabadwa ndalama paakaunti yanu koma sinapatsire ndalama zimenezi. Nthawi zambiri ndi vuto la chida — osati chifukwa chomwe mwachita. SwitchGuard amadziwa zimenezi ndikuyamba kubwezera ndalama.",
    },
  },
  {
    id: "reversal-speed",
    keywords: ["reversal", "how fast", "how long", "minutes", "time", "credit", "back", "refund", "bwezera", "mkupuno"],
    en: {
      q: "How fast do reversals happen?",
      a: "Once SwitchGuard confirms the dispense error through the ATM log, transaction ID, and ownership checks, the reversal is processed automatically. Most reversals complete within 2 to 10 minutes, and you'll receive an SMS confirmation when the funds are credited back.",
    },
    ch: {
      q: "Bwezera amachitika msangawi?",
      a: "SwitchGuard atapoona kuti ndi dispense error kudzera pa ATM log, transaction ID, ndi kuyeza milandu, bwezera amachitika otomoka. Bwezera ambiri amaliza m'ma mphindi 2 mpaka 10, ndipo mudzalandira SMS kutsimikizira poti ndalama zabwezeredwa.",
    },
  },
  {
    id: "block-card",
    keywords: ["block", "lost", "stolen", "stole", "card", "someone", "theft", "tsekera", "tayala", "yabedwa"],
    en: {
      q: "How do I block a lost or stolen card?",
      a: "Go to the Security page and tap Block Card, or use USSD by dialling *384*46# and selecting option 3 from any phone. Blocking takes effect immediately — no branch visit needed. You can unblock it later from the same page if you find it.",
    },
    ch: {
      q: "Ndiwonetsera bwanji kadi yotayidwa kapena yabedwa?",
      a: "Pita ku Security page ndikudina Block Card, kapena gwiritsani USSD pochira *384*46# ndikusankha option 3 kuchoka ku foni iliyonse. Kutsekera kumayamba nthawi yomwe — osafunika kupita ku bank. Mungatsegule kembali ku page yomweyo muli kupeza.",
    },
  },
  {
    id: "two-factor",
    keywords: ["2fa", "two-factor", "two factor", "security tip", "authentication", "approve", "verification", "chitetezo", "chinsinsi"],
    en: {
      q: "What is the security tip / 2FA for?",
      a: "Two-factor authentication adds a second approval step when logging in, so even if someone gets your password, they still can't access your account without the second verification. You can manage it from the Security settings.",
    },
    ch: {
      q: "Security tip / 2FA ndi ya chiyani?",
      a: "Two-factor authentication imapatsa chilolezo chachiwiri poti mulowe m'akaunti, kotero ngati munthu ali ndi mawu achinsinsi anu, sadzatha kulowa m'akaunti yanu popanda kuyezetsa kachiwiri. Mungayimange mu Security settings.",
    },
  },
  {
    id: "ussd-banking",
    keywords: ["ussd", "phone", "feature phone", "no internet", "no app", "no smartphone", "dial", "code", "any phone", "*384*46"],
    en: {
      q: "How do I use USSD banking?",
      a: "Dial *384*46# from any phone — smartphone or basic feature phone. No internet or app required. You can check your balance, report a failed withdrawal, block your card, and see recent alerts, all through a simple text menu.",
    },
    ch: {
      q: "Ndiwagwiritsa bwanji USSD banking?",
      a: "Pechirani *384*46# kuchoka ku foni iliyonse — smartphone kapena foni yosavuta. Osafunika intaneti kapena app. Mungaone baki, muziwuza za withdrawal yolephera, kutsekera kadi yanu, ndikuona alerts zachilendo, zonse kudzera pa menyu yosavuta.",
    },
  },
  {
    id: "fallback",
    keywords: [],
    en: {
      q: "",
      a: "I'm not sure about that yet — try Contact Support for help from our team.",
    },
    ch: {
      q: "",
      a: "Sindine woyimira kale — yesetsani Contact Support kuti mupeze thandizo kuchoka kwa ife.",
    },
  },
];
