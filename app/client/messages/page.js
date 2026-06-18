"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { showToast, openModal } from "@/lib/store";

export default function C_messagesPage() {
  const router = useRouter();
  
  const messages = [
    { id: 1, sender: "Anjali Mehta", role: "Staff", avatar: "AM", color: "navy", text: "Hi James, I've reviewed your UK passport upload. It looks perfect. Please proceed with the stamped DLS Sale Agreement when you have it.", date: "Today, 10:45 AM", unread: true },
    { id: 2, sender: "Rohan Kapoor", role: "Staff", avatar: "RK", color: "purple", text: "Regarding your statutory single declaration for Oliver — we've verified the FCDO apostille. We'll update the Ministry as soon as we submit.", date: "Yesterday, 2:15 PM", unread: false },
    { id: 3, sender: "System", role: "Notification", avatar: "S", color: "gray-500", text: "Your application 'Fast Track (Permanent Residence)' has been updated to 'Action needed'.", date: "May 9, 2026", unread: false },
  ];

  return (
    <>
      <div className="ph">
        <div className="lhs">
          <div className="eyebrow">Workspace</div>
          <h1>Messages</h1>
          <div className="sub">Direct channel with your advisors</div>
        </div>
        <div className="actions">
          <button className="btn blue sm" onClick={() => openModal('support')}><i className="ti ti-plus"></i> New message</button>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '12px'}}>
        {messages.map(m => (
          <div key={m.id} className="card" style={{cursor: 'pointer', borderLeft: m.unread ? '3px solid var(--blue)' : '1px solid var(--gray-200)'}} onClick={() => openModal('chat', m.sender)}>
            <div className="card-b" style={{display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
              <div className={`avatar ${m.color} lg`}>{m.avatar}</div>
              <div style={{flex: '1'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                  <div>
                    <span style={{fontWeight: '700', color: 'var(--navy)', fontSize: '15px'}}>{m.sender}</span>
                    <span className="badge mu" style={{marginLeft: '8px', fontSize: '10px'}}>{m.role}</span>
                  </div>
                  <span style={{fontSize: '11px', color: 'var(--gray-500)'}}>{m.date}</span>
                </div>
                <div style={{fontSize: '13px', color: 'var(--gray-700)', lineHeight: '1.5', maxHeight: '40px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical'}}>
                  {m.text}
                </div>
              </div>
              {m.unread && <div style={{width: '8px', height: '8px', background: 'var(--blue)', borderRadius: '50%', marginTop: '6px'}}></div>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
