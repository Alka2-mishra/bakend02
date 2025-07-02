import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt" 

const userSchema = new mongoose.Schema(
    {
        username :{
            type :String,
            require:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
             type :String,
            require:true,
            unique:true,
            lowercase:true,
            trim:true,
            
        },
        fullName:{
             type :String,
            require:true,
            lowercase:true,
            trim:true,
            index:true
        },
        avatar:{
            type:string,
            require:true,

        },
        coverimage:{
            type:String,
        },
        watchhistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:string,
        require:[true,'password is required']
    },
    refreshToken:{
        type:string,
    }
    

    
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(this.isModified(this.password)) return next()
    this.password = bcrypt.hash(this.password,10)
     next()

})
userSchema.method.isPasswordCorrect = async function
(password){
  await bcrypt.compare(password,this.password)
}
userSchema.methods.genrateAccesToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}
userSchema.methods.genrateRefreshToken = function(){}
export const  User = mongoose.model("User",userSchema)