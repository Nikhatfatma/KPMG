"use client";
import { create } from "zustand";

// ============================ TOAST ============================
export const useToastStore = create((set) => ({
  visible: false,
  title: "",
  sub: "",
  isError: false,
  show: (title, sub, isError = false) => {
    set({ visible: true, title: title || "Done", sub: sub || "", isError: !!isError });
    if (typeof window !== "undefined") {
      clearTimeout(useToastStore._t);
      useToastStore._t = setTimeout(() => set({ visible: false }), 3200);
    }
  },
  hide: () => set({ visible: false }),
}));
export function showToast(title, sub, isError) {
  useToastStore.getState().show(title, sub, isError);
}

// ============================ MODAL ============================
export const useModalStore = create((set) => ({
  open: false,
  type: "",
  context: "",
  openModal: (type, context = "") => set({ open: true, type, context }),
  closeModal: () => set({ open: false }),
}));
export function openModal(type, context) {
  useModalStore.getState().openModal(type, context);
}
export function closeModal() {
  useModalStore.getState().closeModal();
}

// ============================ WIZARD ============================
const blankDraft = {
  step: 1,
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  clientInitials: "",
  clientColor: "navy",
  clientSource: "",
  serviceId: "",
  serviceName: "",
  serviceDeadline: 30,
  suggestedServiceId: "",
  familyMembers: [],
  documents: [],
  questions: [],
};

export const useWizardStore = create((set, get) => ({
  draft: { ...blankDraft },
  setDraft: (patch) => set({ draft: { ...get().draft, ...patch } }),
  reset: () => set({ draft: { ...blankDraft } }),
  goToStep: (n) => set({ draft: { ...get().draft, step: n } }),
  pickClient: (info) => {
    const d = { ...get().draft, ...info };
    d.familyMembers = [
      { id: "main", name: info.clientName, role: "Main applicant", avatar: info.clientInitials, color: info.clientColor, locked: true },
    ];
    set({ draft: d });
  },
  pickService: (svcId, svcName, deadline, TEMPLATES) => {
    const tpl = TEMPLATES[svcId];
    const d = { ...get().draft, serviceId: svcId, serviceName: svcName, serviceDeadline: deadline };
    if (tpl) {
      d.documents = tpl.documents.map((x) => ({ ...x, included: true, custom: false }));
      d.questions = tpl.questions.map((x) => ({ ...x, included: true, custom: false }));
    }
    set({ draft: d });
  },
  toggleItem: (kind, id) => {
    const d = { ...get().draft };
    const arr = kind === "doc" ? [...d.documents] : [...d.questions];
    const i = arr.findIndex((x) => x.id === id);
    if (i < 0) return;
    arr[i] = { ...arr[i], included: !arr[i].included };
    if (kind === "doc") d.documents = arr;
    else d.questions = arr;
    set({ draft: d });
  },
  toggleItemRequired: (kind, id) => {
    const d = { ...get().draft };
    const arr = kind === "doc" ? [...d.documents] : [...d.questions];
    const i = arr.findIndex((x) => x.id === id);
    if (i < 0) return;
    arr[i] = { ...arr[i], required: !arr[i].required };
    if (kind === "doc") d.documents = arr;
    else d.questions = arr;
    set({ draft: d });
  },
  removeItem: (kind, id) => {
    const d = { ...get().draft };
    if (kind === "doc") d.documents = d.documents.filter((x) => x.id !== id);
    else d.questions = d.questions.filter((x) => x.id !== id);
    set({ draft: d });
  },
  addCustomDoc: (name, desc, required, perMember) => {
    const d = { ...get().draft };
    const item = { id: "d-cust-" + Date.now(), name, desc: desc || "", required: !!required, included: true, custom: true };
    if (perMember) item.collectPer = "familyMember";
    d.documents = [...d.documents, item];
    set({ draft: d });
  },
  addCustomQuestion: (text, type, required, perMember) => {
    const d = { ...get().draft };
    const item = { id: "q-cust-" + Date.now(), text, type: type || "Short text", required: !!required, included: true, custom: true };
    if (perMember) item.answerPer = "familyMember";
    d.questions = [...d.questions, item];
    set({ draft: d });
  },
  addFamilyMember: (name, role) => {
    const d = { ...get().draft };
    const parts = name.split(/\s+/);
    const initials = ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
    const palette = ["purple", "cyan", "pink", "blue", "amber"];
    const used = d.familyMembers.map((m) => m.color);
    const color = palette.find((c) => !used.includes(c)) || palette[d.familyMembers.length % palette.length];
    const id = "m" + Date.now();
    d.familyMembers = [...d.familyMembers, { id, name, role, avatar: initials, color, locked: false }];
    set({ draft: d });
  },
  removeFamilyMember: (id) => {
    const d = { ...get().draft };
    d.familyMembers = d.familyMembers.filter((m) => m.id !== id);
    ["documents", "questions"].forEach((k) => {
      d[k] = d[k].map((it) => it.excludedMembers ? { ...it, excludedMembers: it.excludedMembers.filter((mid) => mid !== id) } : it);
    });
    set({ draft: d });
  },
  togglePerMemberItem: (kind, itemId, memberId) => {
    const d = { ...get().draft };
    const arr = kind === "doc" ? [...d.documents] : [...d.questions];
    const i = arr.findIndex((x) => x.id === itemId);
    if (i < 0) return;
    const excluded = arr[i].excludedMembers || [];
    const idx = excluded.indexOf(memberId);
    const next = idx >= 0 ? excluded.filter((x) => x !== memberId) : [...excluded, memberId];
    arr[i] = { ...arr[i], excludedMembers: next };
    if (kind === "doc") d.documents = arr;
    else d.questions = arr;
    set({ draft: d });
  },
  setPerMember: (kind, itemId, on) => {
    const d = { ...get().draft };
    const arr = kind === "doc" ? [...d.documents] : [...d.questions];
    const i = arr.findIndex((x) => x.id === itemId);
    if (i < 0) return;
    const patch = { excludedMembers: [] };
    if (kind === "doc") patch.collectPer = on ? "familyMember" : "application";
    else patch.answerPer = on ? "familyMember" : "application";
    arr[i] = { ...arr[i], ...patch };
    if (kind === "doc") d.documents = arr;
    else d.questions = arr;
    set({ draft: d });
  },
}));

// ============================ PROJECTS ============================
const INITIAL_PROJECTS = [
  { id: "p1", clientName: "Dmitri Volkov", service: "Fast Track PR", status: "New request", color: "navy", initials: "DV", source: "Zoho", owner: "AM",
    familyMembers: [
      { id: "dv", name: "Dmitri Volkov", role: "Main applicant", avatar: "DV", color: "navy", locked: true },
      { id: "ev", name: "Elena Volkova", role: "Spouse", avatar: "EV", color: "purple", locked: false },
    ]
  },
  { id: "p2", clientName: "Olivia Chen", service: "Fast Track PR", status: "New request", color: "cyan", initials: "OC", source: "Manual", owner: "RK",
    familyMembers: [
      { id: "oc", name: "Olivia Chen", role: "Main applicant", avatar: "OC", color: "cyan", locked: true },
    ]
  },
  { id: "p3", 
    clientName: "James Smith", 
    service: "Fast Track PR", 
    status: "Docs pending", 
    color: "navy", 
    initials: "JS", 
    source: "Zoho", 
    owner: "AM", 
    progress: 40, 
    docStats: "4/15",
    familyMembers: [
      { id: "js", name: "James Smith", role: "Main applicant", avatar: "JS", color: "navy", locked: true, origin: "United Kingdom", residence: "UK" },
      { id: "ss", name: "Sarah Smith", role: "Spouse", avatar: "SS", color: "purple", locked: false, origin: "United Kingdom", residence: "UK" },
      { id: "os", name: "Oliver Smith", role: "Child (19, Student)", avatar: "OS", color: "blue", locked: false, age: 19, origin: "United Kingdom", residence: "UK" },
      { id: "es", name: "Emily Smith", role: "Child (12)", avatar: "ES", color: "cyan", locked: false, age: 12, origin: "United Kingdom", residence: "UK" },
    ]
  },
  { id: "p4", clientName: "Nikos Andreou", service: "Fast Track PR", status: "Docs pending", color: "purple", initials: "NA", source: "Zoho", owner: "SP", progress: 45, docStats: "5/11" },
  { id: "p5", clientName: "James Wallace", service: "Pink Slip", status: "Under review", color: "navy", initials: "JW", source: "Zoho", owner: "RK", progress: 90, docStats: "11/11 ok" },
];

export const useProjectsStore = create((set, get) => ({
  projects: [...INITIAL_PROJECTS],
  addProject: (proj) => set({ projects: [{ ...proj, id: "p-" + Date.now(), familyMembers: proj.familyMembers || [] }, ...get().projects] }),
  updateProject: (id, patch) => set({
    projects: get().projects.map(p => p.id === id ? { ...p, ...patch } : p)
  }),
  addMemberToProject: (projectId, member) => {
    const proj = get().projects.find(p => p.id === projectId);
    if (!proj) return;
    const parts = member.name.split(/\s+/);
    const initials = ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
    const nextMember = { id: "m-" + Date.now(), ...member, avatar: initials, color: "blue" };
    set({
      projects: get().projects.map(p => p.id === projectId ? { ...p, familyMembers: [...(p.familyMembers || []), nextMember] } : p)
    });
  }
}));

// ============================ CLIENTS ============================
const INITIAL_CLIENTS = [
  { id: "dv", name: "Dmitri Volkov",   email: "d.volkov@volkov-cap.com",            phone: "+7 925 482 1102", initials: "DV", color: "navy",   suggested: "fast-track", source: "Zoho",   suggestLabel: "Fast Track PR", status: "Active" },
  { id: "oc", name: "Olivia Chen",     email: "o.chen@chenholdings.hk",             phone: "+852 6291 4408",  initials: "OC", color: "cyan",   suggested: "fast-track", source: "Zoho",   suggestLabel: "Fast Track PR", status: "Active" },
  { id: "na", name: "Nikos Andreou",   email: "nikos.andreou@andreouholdings.com",  phone: "+357 99 482106",  initials: "NA", color: "purple", suggested: "fast-track", source: "Zoho",   suggestLabel: "Fast Track PR", status: "Pending" },
  { id: "ec", name: "Elena Christou",  email: "elena.c@christouwealth.co.uk",       phone: "+44 7700 901234", initials: "EC", color: "pink",   suggested: "pink-slip",  source: "Manual", suggestLabel: "Pink Slip", status: "Submitted" },
  { id: "js", name: "James Smith",    email: "james@smith-holdings.uk",           phone: "+44 7700 900123",initials: "JS", color: "navy",   suggested: "fast-track", source: "Zoho",   suggestLabel: "Fast Track PR", status: "Pending" },
  { id: "jw", name: "James Wallace",   email: "james@wallace-digital.uk",           phone: "+44 7958 110293", initials: "JW", color: "navy",   suggested: "pink-slip",  source: "Zoho",   suggestLabel: "Pink Slip", status: "Submitted", renewalNote: "Pink Slip renewal due Jun 04" },
  { id: "mh", name: "Mariam Habib",    email: "mariam.habib@habib-group.com",       phone: "+961 3 482 117",  initials: "MH", color: "purple", suggested: "fast-track", source: "Manual", suggestLabel: "Fast Track PR", status: "Pending" },
];

export const useClientsStore = create((set, get) => ({
  clients: [...INITIAL_CLIENTS],
  addClient: (client) => {
    const parts = (client.name || "").trim().split(/\s+/);
    const initials = ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
    const palette = ["navy", "cyan", "purple", "pink", "blue", "amber"];
    const color = palette[get().clients.length % palette.length];
    
    const newClient = {
      id: "c-" + Date.now(),
      ...client,
      initials,
      color,
      source: "Manual",
      suggested: "fast-track",
      suggestLabel: "Fast Track PR"
    };
    
    set({ clients: [newClient, ...get().clients] });
    return newClient;
  }
}));

// ============================ MEMBER VIEW (client-side filter) ============================
export const useMemberViewStore = create((set) => ({
  viewing: "main", // 'main' | 'ss' | 'os' | 'es'
  member: { id: "main", name: "James Smith", role: "Main applicant", avatar: "JS", color: "navy" },
  setMember: (m) => set({ viewing: m.id, member: m }),
  reset: () => set({ viewing: "main", member: { id: "main", name: "James Smith", role: "Main applicant", avatar: "JS", color: "navy" } }),
}));
