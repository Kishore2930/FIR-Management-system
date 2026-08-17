
CREATE TABLE fir_cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fir_number TEXT NOT NULL UNIQUE,
  complainant_name TEXT NOT NULL,
  complainant_address TEXT NOT NULL,
  complainant_phone TEXT NOT NULL,
  incident_subject TEXT NOT NULL,
  incident_description TEXT NOT NULL,
  incident_location TEXT NOT NULL,
  incident_date DATE NOT NULL,
  incident_time TEXT NOT NULL,
  witnesses TEXT,
  suspect_info TEXT,
  property_involved TEXT,
  status TEXT NOT NULL DEFAULT 'Pending Review',
  priority TEXT NOT NULL DEFAULT 'Medium',
  assigned_to TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fir_cases_fir_number ON fir_cases(fir_number);
CREATE INDEX idx_fir_cases_status ON fir_cases(status);
CREATE INDEX idx_fir_cases_created_at ON fir_cases(created_at);

INSERT INTO fir_cases (fir_number, complainant_name, complainant_address, complainant_phone, incident_subject, incident_description, incident_location, incident_date, incident_time, status, priority, assigned_to, witnesses, suspect_info, property_involved) VALUES
('FIR-2024-001', 'Rajesh Kumar', 'Flat 301, Sunrise Apartments, Sector 15, Delhi - 110001', '+91-9876543210', 'Theft of Mobile Phone', 'I was walking near the metro station around 2:30 PM when someone snatched my mobile phone from my hand and ran away. The phone was a Samsung Galaxy S23 Ultra worth Rs. 1,25,000. I tried to chase the person but lost sight in the crowd.', 'Sector 15 Metro Station, Delhi', '2024-01-15', '14:30', 'Under Investigation', 'Medium', 'SI Priya Sharma', 'Security guard at metro station saw the incident', 'Young male, approximately 20-25 years, wearing black jacket', 'Samsung Galaxy S23 Ultra, black color, IMEI: 123456789012345'),
('FIR-2024-002', 'Anita Desai', 'House No. 45, MG Road, Bangalore - 560001', '+91-9876543211', 'Property Dispute', 'There is an ongoing dispute with my neighbor regarding the boundary wall between our properties. They have started construction that encroaches on my property by approximately 3 feet. Despite multiple verbal requests, they refuse to stop the construction.', 'MG Road, Bangalore', '2024-01-14', '10:15', 'Pending Review', 'Low', 'Inspector Vikram Singh', 'Municipal surveyor who inspected the property', 'Neighbor: Mr. Suresh Patel', 'Land parcel, boundary wall dispute'),
('FIR-2024-003', 'Mohammed Ali', 'Shop No. 12, NH-24, Ghaziabad - 201001', '+91-9876543212', 'Road Accident - Hit and Run', 'A speeding car hit my motorcycle from behind while I was waiting at a traffic signal. The driver did not stop and fled the scene. I sustained injuries to my leg and arm. The vehicle appeared to be a white sedan, possibly a Honda City.', 'NH-24 Traffic Signal, Ghaziabad', '2024-01-13', '22:45', 'Evidence Collection', 'High', 'ASI Deepak Rao', 'Traffic camera footage available, nearby shopkeeper saw the incident', 'White sedan, possibly Honda City, partial number plate visible: DL-3C-XX', 'Motorcycle damaged (Hero Splendor), medical reports for injuries'),
('FIR-2024-004', 'Sunita Patel', '2nd Floor, Building 7, Andheri West, Mumbai - 400053', '+91-9876543213', 'Domestic Violence', 'I have been subjected to physical and mental abuse by my husband for the past 6 months. Last night, he assaulted me causing injuries to my face and arms. I have medical documentation of the injuries. I am filing this complaint for my safety and that of my children.', 'Andheri West, Mumbai', '2024-01-12', '18:20', 'Closed', 'High', 'SI Kavita Menon', 'Neighbor who heard the altercation', 'Husband: Ramesh Patel', 'Medical reports, photographs of injuries'),
('FIR-2024-005', 'Arjun Reddy', 'Apartment 5B, Banjara Hills, Hyderabad - 500034', '+91-9876543214', 'Cyber Fraud - UPI Scam', 'I received a call from someone claiming to be from my bank. They asked me to share an OTP which I did, thinking it was legitimate. Subsequently, Rs. 45,000 was transferred from my account through UPI to an unknown account. I immediately contacted my bank and filed this complaint.', 'Banjara Hills, Hyderabad', '2024-01-11', '09:00', 'Under Investigation', 'Medium', 'Inspector Rahul Mehta', '', 'Unknown fraudster, phone number: +91-9999999999', 'Bank account details, transaction records, UPI transfer details');
