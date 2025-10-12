

// get user data using userid


import imagekit from "../config/imagekit.js"
import Connection from "../models/Connection.js"
import User from "../models/User.js"
import fs from 'fs'
export const getUserData=async(req,res)=>{
    try {
        const {userId}=req.auth()
        const user= await User.findById(userId)
        if(!user){
            return res.json({success:false ,message:"user not found"})
        }
        res.json({success:true,user})
    } catch (error) {
        console.log(error)
        return res.json({success:false ,message:error.message})
    }
}
// update user data
// export const updateUserData=async(req,res)=>{
//     try {
//         const {userId}=req.auth()
//         let {username,bio,location,full_name}=req.body
//         const tempUser= await User.findById(userId)
//         !username && (username = tempUser.username)
//         if(tempUser.username !== username){
//             const user=User.findOne({username})
//             if(user){
//             //we will not chage userame if it is already take
//             username=tempUser.username
//             }

//         }
//         const updatedData={
//             username,
//             bio,
//             location,
//             full_name
//         }
//     const profile=req.files.profile && req.files.profile[0];
//     const cover=req.files.cover && req.files.cover[0];
//      if(profile){
//         const buffer=fs.readFileSync(profile.path);
//         const response=await imagekit.upload({
//             file:buffer,
//             fileName:profile.originalname,
//         })
//         const url=imagekit.url({
//             path : response.filePath,
//             trasformation:[
//                 {quality:'auto'},
//                 {format:'webp'},
//                 {width:'512'}
//             ]
//         })
//         updatedData.profile_picture=url
//      }
//       if(cover){
//         const buffer=fs.readFileSync(cover.path);
//         const response=await imagekit.upload({
//             file:buffer,
//             fileName:cover.originalname,
//         })
//         const url=imagekit.url({
//             path : response.filepath,
//             trasformation:[
//                 {quality:'auto'},
//                 {format:'webp'},
//                 {width:'1280'}
//             ]
//         })
//         updatedData.cover_photo=url
//      }
//      const updateduser=await User.findByIdAndUpdate(userId,updatedData,{new:true})
//      res.json({success:true,user:updateduser,message:"profile updated successfully"})
//     } catch (error) {
//         console.log(error)
//         return res.json({success:false ,message:error.message})
//     }
// }
export const updateUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    let { username, bio, location, full_name } = req.body;
console.log(username, bio, location, full_name)
    const tempUser = await User.findById(userId);
    if(!tempUser) return res.json({ success: false, message: "User not found" });

    !username && (username = tempUser.username);

    if (tempUser.username !== username) {
      const user = await User.findOne({ username });
      if (user) {
        username = tempUser.username; // keep old username if already taken
      }
    }

    const updatedData = { username, bio, location, full_name };

    const profile = req.files?.profile?.[0];
    const cover = req.files?.cover?.[0];

    if (profile) {
      const buffer = fs.readFileSync(profile.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: profile.originalname,
      });
      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: 'auto' },
          { format: 'webp' },
          { width: '512' },
        ],
      });
      updatedData.profile_picture = url;
    }

    if (cover) {
      const buffer = fs.readFileSync(cover.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: cover.originalname,
      });
      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: 'auto' },
          { format: 'webp' },
          { width: '1280' },
        ],
      });
      updatedData.cover_photo = url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    res.json({ success: true, user: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export const discoverUser=async(req,res)=>{
    try {
        const {userId}=req.auth()
        const{input}=req.body;
        const allUsers=await User.find({
            $or:[
                {username:new RegExp(input,'i')},
                {email:new RegExp(input,'i')},
                {full_name:new RegExp(input,'i')},
                {location:new RegExp(input,'i')}
            ]
        })

        const filteredUsers=allUsers.filter(user=> user._id !== userId);
        return res.json({success:true ,users:filteredUsers})

    } catch (error) {
        console.log(error)
        return res.json({success:false ,message:error.message})
    }
}

//follow user
export const followUser = async (req, res) => {
  try {
    const { userId } = req.auth(); // current logged-in user
    const { id } = req.body;       // user to follow

    // Prevent following yourself
    if (userId === id) {
      return res.json({ success: false, message: "You cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const toUser = await User.findById(id);

    if (!user || !toUser) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if already following
    if (user.following.includes(id)) {
      return res.json({ success: false, message: "You are already following this user" });
    }

    // Add following/follower relationship
    user.following.push(id);
    toUser.followers.push(userId);

    await user.save();
    await toUser.save();

    return res.json({ success: true, message: "Now you are following this user" });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

//unfollow User
export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.auth(); // current logged-in user
    const { id } = req.body;       // user to follow

    // Prevent following yourself
    if (userId === id) {
      return res.json({ success: false, message: "You cannot unfollow yourself" });
    }

    const user = await User.findById(userId);
    const toUser = await User.findById(id);

    if (!user || !toUser) {
      return res.json({ success: false, message: "User not found" });
    }

   
    user.following =user.following.filter(user =>user !== id)
     await user.save();
     toUser.followers =toUser.followers.filter(user =>user !== userId)
    await toUser.save();

    return res.json({ success: true, message: " you are no longer following this user" });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};


// send connection request

export const sendConnectionRequest=async(req,res)=>{
  try {
     const {userId}=req.auth()
     const {id}=req.body;
     //check if user has sent more than 20 connection request in the last 24 hours
     const last24Hours=new Date(Date.now()-24*60*60*1000);
     const connectionRequests=await Connection.find({from_user_id:userId,
      created_at:{$gt :last24Hours}})

      if(connectionRequests.length >=20){
        return res.json({success:false,message:"You have sent more than 20 connection in last 24 hours"})
      }
      const connection=await Connection.findone({
          $or:[{from_user_id:userId},{to_user_id:id},
            {from_user_id:id},{to_user_id:userId}
          ]
      })
      if(!connection){
        await Connection.create({
          from_user_id:userId,
          to_user_id:id
        })
        return res.json({success:true,message:'Connection request sent successfully'})
      }else if(connection && connection.status ==='accepted'){
           return res.json({success:false,message:'you are already connected with this user'})
      }
      return res.json({success:false,message:'connection request pending'})

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
}

//get user connections

export const getUserConnections=async(req,res)=>{
  try {
     const {userId}=req.auth()
   const user = await User.findById(userId).populate(['connections', 'followers', 'following']);
    const connections=user.connections
    const followers=user.followers
    const following=user.following
    const pendingConnections=(await Connection.find({to_user_id:userId,
      status:'pending'}).populate('from_user_id')).map(connection=>connection.from_user_id)
      res.json({success:true,connections,followers,following,pendingConnections})
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
}

// accept the connectrequests
export const acceptConnectionRequest=async(req,res)=>{
  try {
     const {userId}=req.auth()
    const {id}=req.body;
    const connection=await Connection.findOne({from_user_id:id,to_user_id:userId})
    if(!connection){
      return res.json({success:false,message:"connection not found"})
    }
    const user= await User.findById(userId);
    user.connections.push(id);
    await user.save()

    const toUser= await User.findById(id);
    toUser.connections.push(userId);
    await toUser.save()

    connection.status='accepted';
    await connection.save()
   return res.json({success:true,message:"Connection accepted successfully"})
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
}