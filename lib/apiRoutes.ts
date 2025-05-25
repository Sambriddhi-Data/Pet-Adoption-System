import { get } from "lodash";

// routes.ts
export const API_ROUTES = {
    adoptionRequests: (page: number, userId: string, statuses: string[]) =>
        `/api/adoptionRequests?page=${page}&limit=3&userId=${userId}&status=${statuses.join(',')}`,

    rehomeRequests: (page: number, userId: string, statuses: string[]) =>
        `/api/rehomeRequests?page=${page}&limit=3&userId=${userId}&status=${statuses.join(',')}`,
    rehomeRequestStatus: (requestId: string) => `/api/getRehomeRequestStatus?requestId=${requestId}`,
    approveRehomeRequest: (requestId: string) => `/api/approveRehomeRequest?requestId=${requestId}`,
    rejectRehomeRequest: (requestId: string) => `/api/rejectRehomeRequest?requestId=${requestId}`,
    adoptionRequestStatus: (requestId: string) => `/api/getAdoptionRequestStatus?requestId=${requestId}`,
    approveAdoptionRequest: (requestId: string) => `/api/approveAdoptionRequest?requestId=${requestId}`,
    rejectAdoptionRequest: (requestId: string) => `/api/rejectAdoptionRequest?requestId=${requestId}`,
    getShelter: (shelterId: string) => `/api/getShelter?shelterId=${shelterId}`,
    getShelterPets: (shelterId: string, page: number) =>
        `/api/getShelterPets?shelterId=${shelterId}&page=${page}&limit=3`,
    getShelterAdoptionRequests: (shelterId: string, page: number) =>
        `/api/getShelterAdoptionRequests?shelterId=${shelterId}&page=${page}&limit=3`,
    getShelterRehomeRequests: (shelterId: string, page: number) =>
        `/api/getShelterRehomeRequests?shelterId=${shelterId}&page=${page}&limit=3`,
    getShelterPetsCount: (shelterId: string) => `/api/getShelterPetsCount?shelterId=${shelterId}`,
    getShelterAdoptionRequestsCount: (shelterId: string) =>
        `/api/getShelterAdoptionRequestsCount?shelterId=${shelterId}`,
    getShelterRehomeRequestsCount: (shelterId: string) =>
        `/api/getShelterRehomeRequestsCount?shelterId=${shelterId}`,
    getUser: (userId: string) => `/api/getUser?userId=${userId}`,
    getPhoneNumbers: (phoneNumber: string) => `/api/getPhoneNumbers?phn=${phoneNumber}`,
    getPetById: (petId: string) => `/api/getPetById?id=${petId}`,
};

