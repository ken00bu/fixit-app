type Report = {
    id: number;
    ticket: string;
    user: {
        id: number;
        username?: string;
        email?: string;
    };
    assignedTechnician: {
        id: number;
        username?: string;
        email?: string;
    } | null;
    category: {
        id: number;
        name: string;
    };
    slaDate: string; // ISO date
    location: {
        building: {
            name: string;
            faculty: {
                name: string;
                code: string;
            } | null;
        };
        room: string;
        floor: number;
        detail: string;
    };
    title: string;
    description: string;
    adminNote: string | null;
    technicianNote: string | null;
    status: string;
    slaStatus: string;
    priority: {
        name: string;
    };
    imgUrl: string;
    createdAt: string; // ISO date
};

type ReportResponseList = ReportResponse[];

enum ReportStatus {
    PENDING = 'pending',
    PROGRESS = 'progress',
    DONE = 'done',
    REJECTED = 'rejected',
    WITHDRAWN = 'withdrawn',
    CANCELED = 'canceled',
    REJECTED_BY_TECHNICIAN = 'rejected_by_technician'
}

type ReportResponse = {
    total: number;
    reports: Report[];
}


export type { ReportResponse, ReportResponseList, Report };
export { ReportStatus };