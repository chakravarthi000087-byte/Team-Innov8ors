import { PresetNotice } from '../types/actacite';

export const PRESET_NOTICES: PresetNotice[] = [
  {
    id: 'exam-reg-2026',
    title: 'End-Semester Examination Registration, Fee Payment & Concession Circular',
    category: 'Exams & Fees',
    institution: 'National Institute of Technology & Engineering Sciences',
    circularNo: 'NITES/COE/2026/EX-048',
    date: 'February 18, 2026',
    summary: 'Instructions for April/May 2026 End-Semester Examinations, hall ticket physical stamping, and tuition fee concession applications.',
    rawText: `=== Page 1 ===
OFFICE OF THE CONTROLLER OF EXAMINATIONS
NATIONAL INSTITUTE OF TECHNOLOGY & ENGINEERING SCIENCES
Circular Ref: NITES/COE/2026/EX-048                                Date: 18-02-2026

SUBJECT: REGISTRATION FOR EVEN SEMESTER REGULAR & ARREAR EXAMINATIONS (APRIL-MAY 2026)

All undergraduate (B.Tech 2nd, 4th, 6th, and 8th Semesters) and postgraduate (M.Tech/MCA 2nd and 4th Semesters) students are hereby notified that the examination portal for the forthcoming Even Semester Regular and Supplementary Examinations will be open from 20-02-2026.

1. STANDARD REGISTRATION & FEE PAYMENT:
All enrolled students appearing for theory and practical papers must log in to the Student ERP portal (erp.nites.edu/exam) and submit their course registration. The prescribed examination fee of Rs. 2,400/- must be remitted exclusively via the online SBI Collect gateway on or before 15th March 2026 by 5:00 PM.

2. LATE REGISTRATION WITH PENALTY:
Students who fail to submit registration within the standard window may register with a late fine of Rs. 500/- up to 22nd March 2026. NOTE: While the ERP announcement banner indicates the late portal will remain accessible until 11:59 PM on 22nd March 2026, the finance desk payment verification server shuts down at 4:30 PM on that date. Registrations with pending transaction tokens after 4:30 PM will not be generated.

3. PHYSICAL HALL TICKET ATTESTATION:
After completing online registration and fee remittance, every registered student must print two hard copies of the generated Provisional Hall Ticket. Both copies along with the original Institute Identity Card must be submitted in person to the respective Department Head (HOD) office for manual seal and physical signature verification no later than 28th March 2026. Hall tickets lacking the wet ink seal will not be admitted into the examination hall.

=== Page 2 ===
4. MERIT-CUM-MEANS (MCM) EXAMINATION FEE WAIVER:
Students belonging to families whose gross annual household income is certified to be less than Rs. 3,00,000/- per annum are eligible to claim a 100% waiver of examination fees. 

Eligible candidates must physically submit the prescribed MCM Fee Concession Form (Form EX-12B) to the Student Welfare Cell (Room 104, Administrative Block) strictly on or before 10th March 2026.

The concession form must be strictly enclosed with the following attested enclosures:
(a) Self-attested copy of the previous semester Grade Sheet / Mark Statement.
(b) Original Income Certificate issued by an officer not below the rank of Revenue Tehsildar, issued on or after 1st January 2026.
(c) Copy of the first page of the applicant's nationalized bank passbook displaying legible Account Number and IFSC Code.
(d) Photocopy of Student Aadhaar Card and Institute Identity Card.

5. SPECIAL PROVISION FOR ARREAR CANDIDATES:
Students carrying active arrear backlogs from prior academic years are advised that their fee concession is subject to approval from the Academic Review Committee. Arrear students should consult their faculty mentor before applying, but the circular does not stipulate the exact deadline or supplemental clearance form required for arrear waiver endorsement.

By Order,
Prof. S. R. Ramanathan
Controller of Examinations
Copy to: All Notice Boards, Dean (Academic), Registrar`,
    precomputed: {
      notice_title: 'End-Semester Examination Registration, Fee Payment & Concession Circular',
      extracted_tasks: [
        {
          task_description: 'Register for courses and pay prescribed examination fee of Rs. 2,400 via online SBI Collect gateway',
          deadline: '15th March 2026 by 5:00 PM',
          eligibility: 'All enrolled undergraduate (B.Tech 2nd, 4th, 6th, 8th Sem) and postgraduate (M.Tech/MCA 2nd, 4th Sem) students appearing for theory and practical papers',
          required_documents: ['Student ERP login credentials', 'Online payment receipt/token'],
          evidence: {
            exact_quote: 'The prescribed examination fee of Rs. 2,400/- must be remitted exclusively via the online SBI Collect gateway on or before 15th March 2026 by 5:00 PM.',
            page_reference: 'Page 1'
          },
          needs_review: false,
          review_reason: null
        },
        {
          task_description: 'Late registration with Rs. 500 penalty fee',
          deadline: '22nd March 2026 (Conflicting cutoff: 4:30 PM finance desk vs 11:59 PM ERP portal)',
          eligibility: 'Students who fail to submit registration within the standard window (before 15th March 2026)',
          required_documents: ['ERP transaction token', 'Late fee remittance receipt'],
          evidence: {
            exact_quote: 'NOTE: While the ERP announcement banner indicates the late portal will remain accessible until 11:59 PM on 22nd March 2026, the finance desk payment verification server shuts down at 4:30 PM on that date.',
            page_reference: 'Page 1'
          },
          needs_review: true,
          review_reason: 'Contradictory closure times: ERP portal claims 11:59 PM cutoff on 22nd March 2026, but finance payment verification server shuts down at 4:30 PM.'
        },
        {
          task_description: 'Submit two printed copies of Provisional Hall Ticket and Institute ID card to HOD office for physical signature and wet ink seal',
          deadline: '28th March 2026',
          eligibility: 'Every registered student',
          required_documents: ['Two printed copies of Provisional Hall Ticket', 'Original Institute Identity Card'],
          evidence: {
            exact_quote: 'Both copies along with the original Institute Identity Card must be submitted in person to the respective Department Head (HOD) office for manual seal and physical signature verification no later than 28th March 2026.',
            page_reference: 'Page 1'
          },
          needs_review: false,
          review_reason: null
        },
        {
          task_description: 'Submit MCM Fee Concession Form (Form EX-12B) with required enclosures to Student Welfare Cell (Room 104)',
          deadline: '10th March 2026',
          eligibility: 'Students belonging to families with gross annual household income certified under Rs. 3,00,000/-',
          required_documents: [
            'Prescribed MCM Fee Concession Form (Form EX-12B)',
            'Self-attested copy of previous semester Grade Sheet',
            'Original Tehsildar Income Certificate (issued on/after 1st Jan 2026)',
            'Copy of first page of nationalized bank passbook',
            'Photocopy of Student Aadhaar Card',
            'Photocopy of Institute Identity Card'
          ],
          evidence: {
            exact_quote: 'Eligible candidates must physically submit the prescribed MCM Fee Concession Form (Form EX-12B) to the Student Welfare Cell (Room 104, Administrative Block) strictly on or before 10th March 2026.',
            page_reference: 'Page 2'
          },
          needs_review: false,
          review_reason: null
        },
        {
          task_description: 'Obtain Academic Review Committee approval and mentor endorsement for arrear backlog fee concession',
          deadline: null,
          eligibility: 'Students carrying active arrear backlogs from prior academic years seeking fee concession',
          required_documents: ['Mentor recommendation (unspecified format)'],
          evidence: {
            exact_quote: 'Arrear students should consult their faculty mentor before applying, but the circular does not stipulate the exact deadline or supplemental clearance form required for arrear waiver endorsement.',
            page_reference: 'Page 2'
          },
          needs_review: true,
          review_reason: 'Missing deadline and undefined application form: The circular states arrear fee concession is subject to approval, but does not provide an application deadline or specify the required form.'
        }
      ]
    }
  },
  {
    id: 'scholarship-verification',
    title: 'Directorate of Higher Education — Post-Matric Scholarship Biometric & Document Verification',
    category: 'Scholarships',
    institution: 'State Directorate of Collegiate Education',
    circularNo: 'DCE/SCHOL/PM-2026/891',
    date: 'March 02, 2026',
    summary: 'Mandatory Aadhaar-based e-KYC biometric authentication and physical file submission for Government Post-Matric Scholarships.',
    rawText: `=== Page 1 ===
GOVERNMENT OF KARNATAKA / STATE HIGHER EDUCATION COMMISSION
DIRECTORATE OF COLLEGIATE EDUCATION, BANGALORE
Circular No. DCE/SCHOL/PM-2026/891                               Date: 02-03-2026

URGENT NOTIFICATION: STATE SCHOLARSHIP PORTAL (SSP) 2025-26 AUDIT & PHYSICAL VERIFICATION

All college principals and scholarship liaisons are instructed to ensure that all registered post-matric scholarship beneficiaries complete their physical file scrutiny and biometric Aadhaar authentication.

1. BIOMETRIC E-KYC AT CAMPUS SPECIAL KIOSK:
All 1st, 2nd, and 3rd year scholarship applicants whose applications were approved in the preliminary portal run must visit the Central Computer Centre (Lab 3) to record their iris and fingerprint e-KYC on the state biometric terminal. Biometric authentication hours are from 10:00 AM to 4:00 PM on working days, closing strictly on 15th April 2026.

2. PHYSICAL HARD COPY DOSSIER SUBMISSION:
Every applicant must compile and submit a physical verification dossier at the College Scholarship Counter (Counter No. 4, Ground Floor). The submission window closes on 25th April 2026. 
Mandatory documents to be tied in a tagged cardboard folder:
- Printed SSP Acknowledgement Slip with QR code
- Valid Caste / Category Certificate (digitally signed by Nadakacheri/e-Seva)
- Income Certificate with RD Number valid for current financial year (gross parental income ceiling under Rs. 2,50,000)
- Original Bonafide Student Certificate signed by the College Principal
- Hosteller / Day Scholar Certificate (countersigned by Chief Warden if staying in college hostel)
- Self-attested copy of Aadhaar seeded bank passbook showing active NPCI mapping

=== Page 2 ===
3. AMBIGUOUS AFFIDAVIT REQUIREMENT:
Clause 4(b) mentions: "Students who had an academic break or course migration must furnish a notarized non-employment indemnity bond of Rs. 50." However, Section 7 lists the bond denomination as Rs. 100 on non-judicial stamp paper, creating a conflicting requirement for break-year applicants.

4. DEADLINE CONFLICT NOTICE:
While paragraph 2 of this circular mandates 25th April 2026 for institutional submission, the Departmental Portal Banner states that all institutional approvals will freeze centrally at 12:00 Noon on 20th April 2026. Students are cautioned that documents submitted after 20th April may not be endorsed in time.

Joint Director of Collegiate Education
Bangalore Urban District`,
    precomputed: {
      notice_title: 'State Scholarship Portal (SSP) Biometric & Document Verification Circular',
      extracted_tasks: [
        {
          task_description: 'Complete iris and fingerprint biometric e-KYC authentication on state terminal at Central Computer Centre (Lab 3)',
          deadline: '15th April 2026 at 4:00 PM',
          eligibility: 'All 1st, 2nd, and 3rd year scholarship applicants whose applications were approved in preliminary portal run',
          required_documents: ['Aadhaar Card', 'Student ID card'],
          evidence: {
            exact_quote: 'Biometric authentication hours are from 10:00 AM to 4:00 PM on working days, closing strictly on 15th April 2026.',
            page_reference: 'Page 1'
          },
          needs_review: false,
          review_reason: null
        },
        {
          task_description: 'Submit physical verification dossier in tagged cardboard folder at College Scholarship Counter (Counter 4)',
          deadline: '25th April 2026 (Warning: Central portal freeze stated as 20th April 2026 12:00 Noon)',
          eligibility: 'Every post-matric scholarship applicant',
          required_documents: [
            'Printed SSP Acknowledgement Slip with QR code',
            'Valid Caste / Category Certificate',
            'Income Certificate with RD Number (parental income under Rs. 2.5 LPA)',
            'Original Bonafide Student Certificate signed by Principal',
            'Hosteller / Day Scholar Certificate',
            'Self-attested copy of Aadhaar seeded bank passbook showing NPCI mapping'
          ],
          evidence: {
            exact_quote: 'Every applicant must compile and submit a physical verification dossier at the College Scholarship Counter (Counter No. 4, Ground Floor). The submission window closes on 25th April 2026.',
            page_reference: 'Page 1'
          },
          needs_review: true,
          review_reason: 'Conflicting cutoff dates: Page 1 specifies submission closes on 25th April 2026, but Page 2 warns that central institutional approval freezes at 12:00 Noon on 20th April 2026.'
        },
        {
          task_description: 'Furnish notarized non-employment indemnity bond for academic break or course migration',
          deadline: null,
          eligibility: 'Students who had an academic gap year, study break, or inter-college course migration',
          required_documents: ['Notarized non-employment indemnity bond (Stamp paper denomination disputed: Rs. 50 vs Rs. 100)'],
          evidence: {
            exact_quote: 'Clause 4(b) mentions: "Students who had an academic break or course migration must furnish a notarized non-employment indemnity bond of Rs. 50." However, Section 7 lists the bond denomination as Rs. 100 on non-judicial stamp paper, creating a conflicting requirement for break-year applicants.',
            page_reference: 'Page 2'
          },
          needs_review: true,
          review_reason: 'Conflicting legal requirements: Clause 4(b) requires a Rs. 50 bond while Section 7 specifies a Rs. 100 non-judicial stamp paper. Also, no specific submission deadline is given.'
        }
      ]
    }
  },
  {
    id: 'internship-noc',
    title: 'Dean of Academic Affairs — Mandatory Summer Industrial Internship & NOC Clearance Order',
    category: 'Internships & NOC',
    institution: 'Apex University Institute of Technology',
    circularNo: 'AUIT/ACAD/2026/NOC-102',
    date: 'January 14, 2026',
    summary: 'Guidelines for 6th Semester B.Tech mandatory industrial training, safety undertakings, and official No Objection Certificate (NOC) issuance.',
    rawText: `=== Page 1 ===
APEX UNIVERSITY INSTITUTE OF TECHNOLOGY
OFFICE OF THE DEAN (ACADEMIC AFFAIRS)
Ref: AUIT/ACAD/2026/NOC-102                                      Date: 14-01-2026

ORDER: GUIDELINES FOR 6TH SEMESTER MANDATORY SUMMER INDUSTRIAL INTERNSHIP

As per Section 8.3 of Academic Regulations 2023, every pre-final year (6th Semester) B.Tech student must complete a minimum of 6 weeks of verified industrial training in an accredited industry or research laboratory between May and July 2026.

1. SUBMISSION OF INTERNSHIP OFFER LETTER & NOC APPLICATION:
Students who have secured an internship offer must apply for an institutional No Objection Certificate (NOC). The application must be filed via the Training & Placement Cell Portal (tp.apexuniv.edu/noc) at least 21 days prior to the start of the internship or by 30th April 2026, whichever is earlier.
Enclosures required for NOC approval:
- Official Offer Letter on corporate letterhead detailing stipend, reporting supervisor, and physical workplace address
- Course Curriculum Alignment Form signed by the departmental Internship Coordinator
- Parent/Guardian Consent and Medical Fitness Certificate

2. SAFETY UNDERTAKING & INDEMNITY BOND:
Before joining the host organization, students undertaking out-of-state or industrial plant training must execute an Indemnity Undertaking on Rs. 100 non-judicial stamp paper, duly notarized by a first-class magistrate, and submit the physical original to Room 210, Academic Block before 10th May 2026.

=== Page 2 ===
3. VIRTUAL / REMOTE INTERNSHIP EXCEPTION CLAUSE:
Students opting for remote or virtual internships must obtain special dispensation from the Academic Council. The notice states: "Remote internships will only be considered under exceptional health circumstances, and applications must be accompanied by a hospital superintendent certificate." The circular does not clarify whether software development internships with remote-first tech companies qualify without medical grounds.

4. WEEKLY LOG BOOK & FINAL REPORT SUBMISSION:
Upon completion of training, every student must maintain a signed weekly activity log book. The bound copy of the Final Internship Technical Report (minimum 35 pages) along with the Completion Certificate signed by the Industry Mentor must be submitted within 10 days of college reopening in August 2026.

Dean (Academic Affairs)
Apex University`,
    precomputed: {
      notice_title: 'Guidelines for 6th Semester Mandatory Summer Industrial Internship & NOC',
      extracted_tasks: [
        {
          task_description: 'Apply for institutional No Objection Certificate (NOC) on T&P portal with required corporate enclosures',
          deadline: 'At least 21 days prior to internship start or by 30th April 2026 (whichever is earlier)',
          eligibility: 'Pre-final year (6th Semester) B.Tech students who have secured an internship offer',
          required_documents: [
            'Official Offer Letter on corporate letterhead with stipend & supervisor details',
            'Course Curriculum Alignment Form signed by departmental Internship Coordinator',
            'Parent/Guardian Consent Form',
            'Medical Fitness Certificate'
          ],
          evidence: {
            exact_quote: 'The application must be filed via the Training & Placement Cell Portal (tp.apexuniv.edu/noc) at least 21 days prior to the start of the internship or by 30th April 2026, whichever is earlier.',
            page_reference: 'Page 1'
          },
          needs_review: false,
          review_reason: null
        },
        {
          task_description: 'Execute notarized Indemnity Undertaking on Rs. 100 stamp paper and submit physical original to Room 210',
          deadline: '10th May 2026',
          eligibility: 'Students undertaking out-of-state or industrial plant training',
          required_documents: ['Indemnity Undertaking on Rs. 100 non-judicial stamp paper notarized by first-class magistrate'],
          evidence: {
            exact_quote: 'Before joining the host organization, students undertaking out-of-state or industrial plant training must execute an Indemnity Undertaking on Rs. 100 non-judicial stamp paper, duly notarized by a first-class magistrate, and submit the physical original to Room 210, Academic Block before 10th May 2026.',
            page_reference: 'Page 1'
          },
          needs_review: false,
          review_reason: null
        },
        {
          task_description: 'Submit remote internship dispensation request to Academic Council',
          deadline: null,
          eligibility: 'Students opting for remote or virtual internships',
          required_documents: ['Hospital superintendent medical certificate'],
          evidence: {
            exact_quote: 'The circular does not clarify whether software development internships with remote-first tech companies qualify without medical grounds.',
            page_reference: 'Page 2'
          },
          needs_review: true,
          review_reason: 'Ambiguous policy: The circular implies remote internships require hospital superintendent medical certificates and fails to clarify eligibility for legitimate remote software internships.'
        },
        {
          task_description: 'Submit bound Final Internship Technical Report (min 35 pages) and signed weekly activity log book to department',
          deadline: 'Within 10 days of college reopening in August 2026',
          eligibility: 'All 6th Semester students completing industrial training',
          required_documents: [
            'Bound copy of Final Internship Technical Report (minimum 35 pages)',
            'Signed weekly activity log book',
            'Completion Certificate signed by Industry Mentor'
          ],
          evidence: {
            exact_quote: 'The bound copy of the Final Internship Technical Report (minimum 35 pages) along with the Completion Certificate signed by the Industry Mentor must be submitted within 10 days of college reopening in August 2026.',
            page_reference: 'Page 2'
          },
          needs_review: true,
          review_reason: 'Unspecified calendar date: The deadline is defined as "within 10 days of college reopening in August 2026", but the exact reopening date is not provided in this notice.'
        }
      ]
    }
  },
  {
    id: 'hostel-clearance',
    title: 'Chief Warden Office — Annual Hostel Room Vacating & Caution Deposit Refund Circular',
    category: 'Hostel & Housing',
    institution: 'Metropolitan University Hostels Board',
    circularNo: 'MUHB/CW/2026/04-CLR',
    date: 'April 05, 2026',
    summary: 'Room inspection protocols, key handover, mess balance settlement, and caution deposit refund procedures for graduating residents.',
    rawText: `=== Page 1 ===
METROPOLITAN UNIVERSITY HOSTELS BOARD
OFFICE OF THE CHIEF WARDEN
Circular No: MUHB/CW/2026/04-CLR                                Date: 05-04-2026

SUBJECT: ROOM VACATING PROCEDURE, INVENTORY SCRUTINY & CAUTION DEPOSIT REFUND (2025-26)

All graduating final-year boarders (UG 4th Year and PG 2nd Year) residing in Aryabhata, Gargi, and Ramanujan Halls of Residence must complete mandatory vacating protocols on or before 31st May 2026.

1. ROOM INVENTORY CHECK & KEY HANDOVER:
Boarders must schedule an inventory inspection with their respective Block Caretaker between 9:00 AM and 5:00 PM. All furniture items (study table, chair, cot, cupboard) must be handed over in intact condition. A signed Inventory Clearance Slip must be counter-signed by the Assistant Warden and submitted along with physical brass room keys at the Hostel Office by 31st May 2026.

2. MESS DUES SETTLEMENT:
Students must clear all pending mess dues up to May 2026 at the Mess Secretary Desk by 25th May 2026. The stamped Mess No-Dues Certificate is mandatory for deposit claims.

=== Page 2 ===
3. CAUTION DEPOSIT REFUND CLAIM SUBMISSION:
To claim refund of the Rs. 10,000/- Hostel Caution Deposit, graduating students must fill out the Caution Money Refund Proforma (Form H-8) and drop it in the submission drop-box at the Warden Office by 15th June 2026.
Enclosures:
- Stamped Mess No-Dues Certificate
- Original Yellow Hostel Admission Receipt (issued at time of joining)
- Cancelled bank cheque with student's name pre-printed
- Photocopy of College Clearance / Library No-Dues Slip

4. BANK ACCOUNT CONFLICT:
Note: Section 3.2 mentions: "Bank account must strictly be in the State Bank of India campus branch." However, Annexure C states: "Any scheduled nationalized bank account in the resident's sole name is acceptable." Students with other bank accounts require immediate clarification before submitting cancelled cheques.

Chief Warden, University Hostels`,
    precomputed: {
      notice_title: 'Hostel Room Vacating & Caution Deposit Refund Procedure (2025-26)',
      extracted_tasks: [
        {
          task_description: 'Schedule inventory inspection, hand over furniture and room keys, and submit signed Inventory Clearance Slip',
          deadline: '31st May 2026',
          eligibility: 'All graduating final-year boarders residing in Aryabhata, Gargi, and Ramanujan Halls',
          required_documents: ['Signed Inventory Clearance Slip counter-signed by Assistant Warden', 'Physical brass room keys'],
          evidence: {
            exact_quote: 'A signed Inventory Clearance Slip must be counter-signed by the Assistant Warden and submitted along with physical brass room keys at the Hostel Office by 31st May 2026.',
            page_reference: 'Page 1'
          },
          needs_review: false,
          review_reason: null
        },
        {
          task_description: 'Settle all pending mess bills and collect stamped Mess No-Dues Certificate',
          deadline: '25th May 2026',
          eligibility: 'All graduating hostel residents',
          required_documents: ['Mess billing receipts'],
          evidence: {
            exact_quote: 'Students must clear all pending mess dues up to May 2026 at the Mess Secretary Desk by 25th May 2026.',
            page_reference: 'Page 1'
          },
          needs_review: false,
          review_reason: null
        },
        {
          task_description: 'Submit Caution Money Refund Proforma (Form H-8) with required enclosures at Warden Office drop-box',
          deadline: '15th June 2026',
          eligibility: 'Graduating students seeking refund of Rs. 10,000/- caution deposit',
          required_documents: [
            'Caution Money Refund Proforma (Form H-8)',
            'Stamped Mess No-Dues Certificate',
            'Original Yellow Hostel Admission Receipt',
            'Cancelled bank cheque',
            'Photocopy of College Clearance / Library No-Dues Slip'
          ],
          evidence: {
            exact_quote: 'To claim refund of the Rs. 10,000/- Hostel Caution Deposit, graduating students must fill out the Caution Money Refund Proforma (Form H-8) and drop it in the submission drop-box at the Warden Office by 15th June 2026.',
            page_reference: 'Page 2'
          },
          needs_review: true,
          review_reason: 'Contradictory banking requirements: Section 3.2 mandates an SBI campus branch account, whereas Annexure C states any nationalized bank account is acceptable.'
        }
      ]
    }
  },
  {
    id: 'convocation-rehearsal',
    title: 'Office of the Registrar — 24th Annual Convocation Protocol, Gown Rental & Rehearsal Notice',
    category: 'Convocation',
    institution: 'Dr. A.P.J. Abdul Kalam Technical University',
    circularNo: 'AKTU/REG/CONV-2026/019',
    date: 'April 20, 2026',
    summary: 'Mandatory ceremonial protocols, academic robe security deposit, mandatory physical rehearsal, and degree in absentia claiming rules.',
    rawText: `=== Page 1 ===
DR. A.P.J. ABDUL KALAM TECHNICAL UNIVERSITY
OFFICE OF THE REGISTRAR & CONVOCATION STEERING COMMITTEE
Notification: AKTU/REG/CONV-2026/019                             Date: 20-04-2026

SUBJECT: 24TH ANNUAL CONVOCATION CEREMONY PROTOCOL & DEGREE RECIPIENT INSTRUCTIONS

The 24th Annual Convocation of the University will be solemnized on Saturday, 23rd May 2026 at 10:30 AM in the University Auditorium.

1. CONVOCATION PORTAL CONFIRMATION:
All eligible degree awardees (Graduating Class of 2025) must register online on the Convocation Portal (convocation.aktu.ac.in) to confirm in-person attendance no later than 5th May 2026 at 5:00 PM. No registration will be accepted under any circumstances after this date.

2. ACADEMIC ROBE / GOWN COLLECTION & SECURITY DEPOSIT:
Degree recipients must collect their certified academic robe and sash from Counter G-1, Sports Pavilion between 1:00 PM and 6:00 PM on 22nd May 2026. A refundable security deposit of Rs. 1,000/- in exact cash currency together with a photo identity card is mandatory. The deposit will be refunded upon safe return of the gown before 4:00 PM on 23rd May 2026.

=== Page 2 ===
3. MANDATORY FULL DRESS REHEARSAL:
Attendance in the full dress rehearsal on 22nd May 2026 at 3:30 PM sharp in the University Auditorium is strictly compulsory for every student receiving their degree in person. Candidates failing to register their attendance biometric punch at the rehearsal hall entrance before 3:45 PM will be disqualified from ascending the stage on Convocation day.

4. DEGREE IN ABSENTIA PROCEDURE:
Graduands unable to attend the ceremony in person may apply for Degree in Absentia by submitting Form CONV-ABS to the Registrar's dispatch section along with a self-addressed registered parcel envelope bearing Rs. 150 postal stamps. The circular mentions "Applications for absentia degrees must be posted within 30 days after the convocation", but does not specify whether online email applications are permitted.

Registrar & Secretary, Convocation Steering Committee`,
    precomputed: {
      notice_title: '24th Annual Convocation Protocol & Degree Recipient Instructions',
      extracted_tasks: [
        {
          task_description: 'Register online on Convocation Portal to confirm in-person attendance',
          deadline: '5th May 2026 at 5:00 PM',
          eligibility: 'All eligible degree awardees (Graduating Class of 2025) intending to attend in person',
          required_documents: ['Student Roll Number', 'Portal registration confirmation slip'],
          evidence: {
            exact_quote: 'All eligible degree awardees (Graduating Class of 2025) must register online on the Convocation Portal (convocation.aktu.ac.in) to confirm in-person attendance no later than 5th May 2026 at 5:00 PM.',
            page_reference: 'Page 1'
          },
          needs_review: false,
          review_reason: null
        },
        {
          task_description: 'Collect academic robe and sash from Counter G-1 and submit Rs. 1,000 cash security deposit',
          deadline: '22nd May 2026 between 1:00 PM and 6:00 PM',
          eligibility: 'In-person degree recipients',
          required_documents: ['Rs. 1,000 refundable security deposit in exact cash', 'Photo identity card'],
          evidence: {
            exact_quote: 'Degree recipients must collect their certified academic robe and sash from Counter G-1, Sports Pavilion between 1:00 PM and 6:00 PM on 22nd May 2026. A refundable security deposit of Rs. 1,000/- in exact cash currency together with a photo identity card is mandatory.',
            page_reference: 'Page 1'
          },
          needs_review: false,
          review_reason: null
        },
        {
          task_description: 'Attend mandatory full dress rehearsal and record biometric punch at University Auditorium entrance',
          deadline: '22nd May 2026 before 3:45 PM (Rehearsal starts at 3:30 PM sharp)',
          eligibility: 'Every student receiving degree in person on the dais',
          required_documents: ['Student ID Card / Convocation Entry Pass'],
          evidence: {
            exact_quote: 'Candidates failing to register their attendance biometric punch at the rehearsal hall entrance before 3:45 PM will be disqualified from ascending the stage on Convocation day.',
            page_reference: 'Page 2'
          },
          needs_review: false,
          review_reason: null
        },
        {
          task_description: 'Return academic robe to claim Rs. 1,000 deposit refund',
          deadline: '23rd May 2026 before 4:00 PM',
          eligibility: 'Degree recipients who rented academic robe',
          required_documents: ['Gown deposit token / receipt', 'Academic robe and sash in intact condition'],
          evidence: {
            exact_quote: 'The deposit will be refunded upon safe return of the gown before 4:00 PM on 23rd May 2026.',
            page_reference: 'Page 1'
          },
          needs_review: false,
          review_reason: null
        },
        {
          task_description: 'Apply for Degree in Absentia by submitting Form CONV-ABS with stamped parcel envelope',
          deadline: 'Within 30 days after convocation (approx 22nd June 2026)',
          eligibility: 'Graduands unable to attend ceremony in person',
          required_documents: ['Form CONV-ABS', 'Self-addressed registered parcel envelope with Rs. 150 postal stamps'],
          evidence: {
            exact_quote: 'The circular mentions "Applications for absentia degrees must be posted within 30 days after the convocation", but does not specify whether online email applications are permitted.',
            page_reference: 'Page 2'
          },
          needs_review: true,
          review_reason: 'Ambiguous submission method: It is unclear whether digital or email submissions are accepted, or if physical postal delivery is strictly required.'
        }
      ]
    }
  }
];
