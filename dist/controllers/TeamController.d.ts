import { Request, Response } from "express";
export declare class TeamMemberController {
    static findMemberByEmail: (req: Request, res: Response) => Promise<void>;
    static getProjectTeam: (req: Request, res: Response) => Promise<void>;
    static addMemberById: (req: Request, res: Response) => Promise<void>;
    static removeMemberId: (req: Request, res: Response) => Promise<void>;
}
