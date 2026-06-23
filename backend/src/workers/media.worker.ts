import {Worker} from 'bullmq'
import storageService from '../service/storage.service';
import { queueConnection }from '../config/queue.config';


const worker = new Worker('videoUpload', async (job) => {
    const { foodItemId, fileBuffer, fileName, mimeType } = job.data;
    
    const file = {
      fileBuffer: Buffer.from(fileBuffer, 'base64'),
      fileName,
      mimeType
    };
  
    // 1. Run your exact ImageKit upload logic
    const uploadResult = await storageService.uploadVideo(file);
    
    // 2. THE DATABASE PART: Update the document using the ID
    // const updatedItem = await foodModel.findByIdAndUpdate(
    //   foodItemId,
    //   {
    //     videoUrl: uploadResult.url,
    //     imageKitFileId: uploadResult.fileId,
    //     uploadStatus: "ready" // Update status to ready
    //   },
    //   { new: true }
    // );
  
    // 3. THE NOTIFICATION PART: Tell the client it's done!
    // Send a real-time event via WebSockets/Socket.io to the user
        // io.to(updatedItem.partnerId).emit('video_ready', {
        // foodItemId: updatedItem._id,
        // url: updatedItem.videoUrl,
        // message: "Your food item video has been processed successfully!"
        // });
  
  }, { connection: queueConnection, concurrency: 5 });