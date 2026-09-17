export interface IJwtPayload {
    _id: string
    role: string
    fullName: string
    profileImage: string | null
    coverPhoto: string | null
    email: string
    phone: string
    googleId: string | null
    isVerifiedByAdmin: boolean
    isProfileCompleted: boolean
    isSuscribed: boolean
    iat: number
    exp: number
}
