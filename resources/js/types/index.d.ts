export type UserRole = "admin" | "technician" | "employee";

export type ReportStatus =
    | "submitted"
    | "under_review"
    | "assigned"
    | "in_progress"
    | "waiting_information"
    | "on_hold"
    | "resolved"
    | "closed"
    | "rejected";

export type ReportPriority = "low" | "medium" | "high" | "urgent";

export interface Department {
    id: number;
    name: string;
    code: string;
    description?: string | null;
    is_active: boolean;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone?: string | null;
    role: UserRole;
    avatar_url?: string | null;
    department_id?: number | null;
    department?: Department | null;
    is_active: boolean;
    email_verified_at?: string | null;
    created_at?: string;
}

export interface FacilityCategory {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    is_active: boolean;
}

export interface FacilityLocation {
    id: number;
    building: string;
    floor: string;
    room_name: string;
    description?: string | null;
    full_location?: string;
}

export interface Facility {
    id: number;
    category_id: number;
    location_id: number;
    facility_code: string;
    name: string;
    brand_model?: string | null;
    serial_number?: string | null;
    status: "operational" | "damaged" | "maintenance" | "retired";
    notes?: string | null;
    category?: FacilityCategory;
    location?: FacilityLocation;
}

export interface ReportStatusHistory {
    id: number;
    report_id: number;
    user_id: number;
    from_status?: string | null;
    to_status: ReportStatus;
    action_note?: string | null;
    created_at: string;
    user?: User;
}

export interface ReportAssignment {
    id: number;
    report_id: number;
    technician_id: number;
    assigned_by: number;
    status: "active" | "reassigned" | "completed";
    notes?: string | null;
    assigned_at: string;
    completed_at?: string | null;
    technician?: User;
    assigned_by_user?: User;
}

export interface ReportAttachment {
    id: number;
    report_id: number;
    user_id: number;
    type: "initial_evidence" | "progress_evidence" | "completion_evidence";
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    created_at: string;
}

export interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    message: string;
    attachment_path?: string | null;
    is_read: boolean;
    read_at?: string | null;
    created_at: string;
    sender?: User;
}

export interface Conversation {
    id: number;
    report_id: number;
    is_locked: boolean;
    last_message_at?: string | null;
    messages?: Message[];
    latest_message?: Message | null;
}

export interface Report {
    id: number;
    ticket_number: string;
    reporter_id: number;
    department_id: number;
    category_id: number;
    location_id: number;
    facility_id?: number | null;
    title: string;
    description: string;
    priority: ReportPriority;
    status: ReportStatus;
    resolution_notes?: string | null;
    rejection_reason?: string | null;
    submitted_at: string;
    resolved_at?: string | null;
    closed_at?: string | null;
    created_at: string;
    updated_at: string;
    reporter?: User;
    department?: Department;
    category?: FacilityCategory;
    location?: FacilityLocation;
    facility?: Facility | null;
    status_histories?: ReportStatusHistory[];
    assignments?: ReportAssignment[];
    active_assignment?: ReportAssignment | null;
    attachments?: ReportAttachment[];
    conversation?: Conversation | null;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash: {
        success?: string | null;
        error?: string | null;
        info?: string | null;
    };
    app: {
        name: string;
        context: string;
        badge: string;
    };
};