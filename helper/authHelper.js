import bcrypt from 'bcrypt';
 export  const hashPassword=async(password)=>{
    try{
        const saltRounds=10;
       const hashedPassword=await bcrypt.hash(password,saltRounds);
       return hashedPassword;
    }catch(error){
        console.log(error);
        throw error;
    }
};
  export const comaprepassword=async(password,hashPassword)=>{
      return bcrypt.compare(password,hashPassword);
}
// export default {hashPassword,comaprepassword};

