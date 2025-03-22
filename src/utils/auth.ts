import bcrypt from 'bcrypt'

export const hashPassword=async(password:string)=>{
    const salt=await bcrypt.genSalt(10);
    const passwordHash=await bcrypt.hash(password,salt);
    return passwordHash
}

export const comparePassword=async(passwordBody,passwordUser)=>{
    const isPasswordValid = await bcrypt.compare(passwordBody, passwordUser);
    return isPasswordValid;
}