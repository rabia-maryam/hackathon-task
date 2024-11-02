// import React from 'react'
// import {auth, provider} from "../config/firebase"
// import { signInWithPopup } from 'firebase/auth'
// import { useNavigate } from 'react-router-dom'
// function Login() {
//     const navigate=useNavigate()
//     async function handlelogin() {
//         try{
//             const data=await signInWithPopup(auth, provider)
//             console.log(data)
//             navigate("/upload")
//         }
//         catch(error){
//             console.error("error")
//         }
//     }
//   return (
//     <div>
//       <button type='button' onClick={handlelogin}>Login With Google</button>
//     </div>
//   )
// }

// export default Login
// import React, { useEffect, useState } from 'react';
// import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
// import { db } from '../config/firebase';
// import { useForm } from 'react-hook-form';

// function Post() {
//   const { register, handleSubmit, reset, formState: { errors } } = useForm();
//   const [posts, setPosts] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const productsCollection = collection(db, 'products');

//   // Fetch posts from Firestore
//   const fetchPosts = async () => {
//     const data = await getDocs(productsCollection);
//     setPosts(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
//   };

//   // Add or update post
//   const onSubmit = async (data) => {
//     try {
//       // Convert image file to Base64 string
//       if (!data.image[0]) {
//         alert('Please select an image file.');
//         return;
//       }

//       const file = data.image[0];
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onloadend = async () => {
//         const base64Image = reader.result;

//         if (editId) {
//           // Update existing post
//           const postDoc = doc(db, 'products', editId);
//           await updateDoc(postDoc, {
//             description: data.description,
//             imageBase64: base64Image,
//           });
//           setEditId(null);
//           alert('Post updated successfully!');
//         } else {
//           // Add new post
//           await addDoc(productsCollection, {
//             description: data.description,
//             imageBase64: base64Image,
//           });
//           alert('Post added successfully!');
//         }

//         reset();
//         fetchPosts(); // Refresh post list
//       };
//     } catch (error) {
//       console.error('Error handling post:', error);
//       alert('Error: ' + error.message);
//     }
//   };

//   // Delete post
//   const deletePost = async (id) => {
//     const postDoc = doc(db, 'products', id);
//     await deleteDoc(postDoc);
//     fetchPosts();
//     alert('Post deleted successfully!');
//   };

//   // Set post for editing
//   const editPost = (post) => {
//     setEditId(post.id);
//     reset({ description: post.description, image: post.imageBase64 });
//   };

//   // Fetch posts on component mount
//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   return (
//     <div>
//       <h1>Post Management</h1>
      
//       {/* Form to add or update post */}
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <input
//           {...register('description', { required: 'Description is required' })}
//           placeholder="Enter description"
//         />
//         {errors.description && <span>{errors.description.message}</span>}
        
//         <input
//           type="file"
//           {...register('image', { required: 'Image is required' })}
//           accept="image/*"
//         />

//         <button type="submit">{editId ? 'Update Post' : 'Add Post'}</button>
//       </form>

//       {/* Display posts with delete and edit options */}
//       <div>
//         <h2>Posts</h2>
//         {posts.map((post) => (
//           <div key={post.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px' }}>
//             <h3>Description:</h3>
//             <p>{post.description}</p>
//             {post.imageBase64 && (
//               <img src={post.imageBase64} alt="Post" style={{ width: '200px', height: 'auto' }} />
//             )}
//             <button onClick={() => deletePost(post.id)}>Delete</button>
//             <button onClick={() => editPost(post)}>Edit</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Post;
// // import React from 'react';
// // import { addDoc, collection } from 'firebase/firestore';
// // import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// // import { db, storage } from '../config/firebase';
// // import { useForm } from 'react-hook-form';

// // function Upload() {
// //   const { register, handleSubmit, reset, formState: { errors } } = useForm();
// //   const productsCollection = collection(db, 'products');

// //   const onSubmit = async (data) => {
// //     try {
// //       // Check if the image file is selected
// //       if (!data.image[0]) {
// //         alert('Please select an image file.');
// //         return;
// //       }

// //       // Upload image to Firebase Storage
// //       const imageRef = ref(storage, `images/${data.image[0].name}`);
// //       await uploadBytes(imageRef, data.image[0]);

// //       // Get the download URL for the uploaded image
// //       const imageUrl = await getDownloadURL(imageRef);

// //       // Add image URL and description to Firestore
// //       await addDoc(productsCollection, {
// //         description: data.description,
// //         imageUrl: imageUrl,
// //       });

// //       // Reset form after successful upload
// //       reset();
// //       alert('Upload successful!');
// //     } catch (error) {
// //       console.error('Error uploading file:', error);
// //       alert('Error uploading file: ' + error.message);
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit(onSubmit)}>
// //       <input
// //         {...register('description', { required: 'Description is required' })}
// //         placeholder="Enter description"
// //       />
// //       {errors.description && <span>{errors.description.message}</span>}
      
// //       <input
// //         type="file"
// //         {...register('image', { required: 'Image is required' })}
// //         accept="image/*"
// //       />
// //       {errors.image && <span>{errors.image.message}</span>}

// //       <button type="submit">Upload</button>
// //     </form>
// //   );
// // }

// // export default Upload;
// import React from 'react';
// import { addDoc, collection } from 'firebase/firestore';
// import { db } from '../config/firebase';
// import { useForm } from 'react-hook-form';

// function Upload() {
//   const { register, handleSubmit, reset, formState: { errors } } = useForm();
//   const productsCollection = collection(db, 'products');

//   const onSubmit = async (data) => {
//     try {
//       // Check if the image file is selected
//       if (!data.image[0]) {
//         alert('Please select an image file.');
//         return;
//       }

//       // Convert image file to Base64 string
//       const file = data.image[0];
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onloadend = async () => {
//         const base64Image = reader.result;

//         // Add Base64 image and description to Firestore
//         await addDoc(productsCollection, {
//           description: data.description,
//           imageBase64: base64Image, // Store the Base64 string in Firestore
//         });

//         // Reset form after successful upload
//         reset();
//         alert('Upload successful!');
//       };
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       alert('Error uploading file: ' + error.message);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <input
//         {...register('description', { required: 'Description is required' })}
//         placeholder="Enter description"
//       />
//       {errors.description && <span>{errors.description.message}</span>}
      
//       <input
//         type="file"
//         {...register('image', { required: 'Image is required' })}
//         accept="image/*"
//       />
//       {errors.image && <span>{errors.image.message}</span>}

//       <button type="submit">Upload</button>
//     </form>
//   );
// }

// export default Upload;
