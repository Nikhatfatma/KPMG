"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { showToast, openModal } from "@/lib/store";

export default function C_documentsPage() {
  const router = useRouter();
  const [docFilter, setDocFilter] = useState("all");

  const docs = [
    { id: 1, name: "Passport_James.pdf", app: "Fast Track (Permanent Residence)", date: "May 06, 2026", size: "1.2 MB", status: "Approved" },
    { id: 2, name: "Sale_Agreement_Limassol.pdf", app: "Fast Track (Permanent Residence)", date: "May 08, 2026", size: "3.2 MB", status: "In review" },
    { id: 3, name: "Chartered_Accountant_Income_Proof.pdf", app: "Fast Track (Permanent Residence)", date: "May 08, 2026", size: "480 KB", status: "In review" },
    { id: 4, name: "Pink_Slip_2025.pdf", app: "Pink Slip 2025", date: "May 03, 2025", size: "850 KB", status: "Approved" },
  ];

  return (
    <>
      <div className="ph">
        <div className="lhs">
          <div className="eyebrow">Workspace</div>
          <h1>My documents</h1>
          <div className="sub">All files uploaded across your {docs.length} applications</div>
        </div>
        <div className="actions">
          <button className="btn ghost sm" onClick={() => showToast("Search documents", "Find any file by name or application")}><i className="ti ti-search"></i> Search</button>
          <button className="btn blue sm" onClick={() => showToast("Request download", "A zip of all your documents will be prepared")}><i className="ti ti-download"></i> Download all</button>
        </div>
      </div>

      <div className="filter-bar">
        <span className={`chip${docFilter === 'all' ? ' on' : ''}`} onClick={() => setDocFilter('all')} style={{cursor: 'pointer'}}>All files</span>
        <span className={`chip${docFilter === 'Approved' ? ' on' : ''}`} onClick={() => setDocFilter('Approved')} style={{cursor: 'pointer'}}>Approved</span>
        <span className={`chip${docFilter === 'Review' ? ' on' : ''}`} onClick={() => setDocFilter('Review')} style={{cursor: 'pointer'}}>In review</span>
      </div>

      <div className="card">
        <div className="card-b" style={{padding: '0'}}>
          <table className="tbl">
            <thead>
              <tr>
                <td>Document</td>
                <td>Application</td>
                <td>Date uploaded</td>
                <td>Size</td>
                <td>Status</td>
                <td style={{width: '32px'}}></td>
              </tr>
            </thead>
            <tbody>
              {docs.filter(d => docFilter === 'all' || d.status.includes(docFilter)).map(d => (
                <tr key={d.id}>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <i className="ti ti-file-type-pdf" style={{fontSize: '20px', color: 'var(--red)'}}></i>
                      <div>
                        <div style={{fontWeight: '700', color: 'var(--navy)', fontSize: '14px'}}>{d.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{fontSize: '13px', color: 'var(--gray-600)'}}>{d.app}</td>
                  <td style={{fontSize: '13px', color: 'var(--gray-600)'}}>{d.date}</td>
                  <td style={{fontSize: '13px', color: 'var(--gray-600)'}}>{d.size}</td>
                  <td><span className={`badge ${d.status === 'Approved' ? 'ok' : 'info'} dot`}>{d.status}</span></td>
                  <td><i className="ti ti-dots-vertical" style={{color: 'var(--gray-400)', cursor: 'pointer'}} onClick={() => showToast("Options", "View · Download · Share")}></i></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
