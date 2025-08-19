// src/services/firebase.js
import { db, storage } from '../firebase/config';
import { doc, getDoc, collection, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

export class FirebaseService {
  // Name mapping to handle variations and nicknames
  static getCanonicalName(inputName) {
    const nameMapping = {
      // Handle variations of names
      'kevin': 'Kevin',
      'kev': 'Kevin',
      'kevinnn': 'Kevin',
      
      'brigita': 'Brigita',
      'brigitaa': 'Brigita',
      'brigittaaa': 'Brigita',
      'brigittaaa.f': 'Brigita',
      'bri': 'Brigita',
      
      'angeline': 'Angeline',
      'angel': 'Angeline',
      'ange': 'Angeline',
      
      'cynthia': 'Cynthia',
      'cynth': 'Cynthia',
      'cin': 'Cynthia',
      
      'denise': 'Denise',
      'deni': 'Denise',
      'den': 'Denise',
      
      'ferine': 'Ferine',
      'fer': 'Ferine',
      'ferin': 'Ferine',
      
      'jgio': 'Jgio',
      'gio': 'Jgio',
      'jg': 'Jgio',
      
      'nabila': 'Nabila',
      'nabi': 'Nabila',
      'bila': 'Nabila',
      
      'navia': 'navia',
      'nav': 'navia',
      'navi': 'navia',
      
      'sarah': 'Sarah',
      'sar': 'Sarah',
      
      'john': 'John',
      'jo': 'John',
    };
    
    const lowerInput = inputName.toLowerCase().trim();
    const canonicalName = nameMapping[lowerInput] || inputName.charAt(0).toUpperCase() + inputName.slice(1).toLowerCase();
    
    console.log(`Name mapping: "${inputName}" → "${canonicalName}"`);
    return canonicalName;
  }

  // Test Firebase connection and explore collections
  static async testConnection() {
    try {
      console.log('Testing Firebase connection...');
      console.log('Database instance:', db);
      
      // Try to list all special codes to see what's available
      console.log('Checking specialCodes collection...');
      const allCodes = await this.getAllSpecialCodes();
      console.log('Available special codes:', allCodes);
      
      // If no special codes found, offer to create sample data
      if (allCodes.length === 0) {
        console.log('No special codes found. Collection is empty.');
        console.log('Would you like to create sample data? Available codes will be:');
        console.log('- test (Test Code)');
        console.log('- admin (Admin Code)'); 
        console.log('- guest (Guest Code)');
        console.log('Call FirebaseService.createSampleData() to create them.');
      }
      
      return true;
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      return false;
    }
  }

  static async getSpecialCodeData(code) {
    try {
      console.log('Attempting to get special code:', code);
      console.log('Database:', db);
      
      // First try exact match (case-sensitive)
      console.log('Trying exact match:', code);
      let docRef = doc(db, 'specialCodes', code);
      let docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log('Document exists (exact match), data:', docSnap.data());
        return docSnap.data();
      }
      
      // If not found, try lowercase
      const codeLower = code.toLowerCase();
      if (codeLower !== code) {
        console.log('Trying lowercase:', codeLower);
        docRef = doc(db, 'specialCodes', codeLower);
        docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log('Document exists (lowercase match), data:', docSnap.data());
          return docSnap.data();
        }
      }
      
      // If not found, try capitalized (first letter uppercase)
      const codeCapitalized = code.charAt(0).toUpperCase() + code.slice(1).toLowerCase();
      if (codeCapitalized !== code && codeCapitalized !== codeLower) {
        console.log('Trying capitalized:', codeCapitalized);
        docRef = doc(db, 'specialCodes', codeCapitalized);
        docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log('Document exists (capitalized match), data:', docSnap.data());
          return docSnap.data();
        }
      }
      
      // Try with specific capitalizations for known patterns
      const specialCases = [
        code.charAt(0).toUpperCase() + code.slice(1), // MandaGaminx from mandagaminx
        'MandaGaminx', // Direct match for this specific case
        'FireSorcerer123', // Direct match for this specific case
      ];
      
      for (const specialCase of specialCases) {
        if (specialCase !== code && specialCase !== codeLower && specialCase !== codeCapitalized) {
          console.log('Trying special case:', specialCase);
          docRef = doc(db, 'specialCodes', specialCase);
          docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            console.log('Document exists (special case match), data:', docSnap.data());
            return docSnap.data();
          }
        }
      }
      
      console.log('No document found with any case variation');
      return null;
    } catch (error) {
      console.error('Error getting special code:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      return null;
    }
  }

  // Mengambil semua gambar untuk code tertentu
  static async getImagesForCode(code) {
    try {
      const imagesRef = collection(db, 'specialCodes', code.toLowerCase(), 'images');
      const querySnapshot = await getDocs(imagesRef);
      
      const images = [];
      querySnapshot.forEach((doc) => {
        images.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return images.sort((a, b) => a.order - b.order); // Sort by order field
    } catch (error) {
      console.error('Error getting images:', error);
      return [];
    }
  }

  // Mengambil semua special codes yang tersedia
  static async getAllSpecialCodes() {
    try {
      const codesRef = collection(db, 'specialCodes');
      const querySnapshot = await getDocs(codesRef);
      
      const codes = [];
      querySnapshot.forEach((doc) => {
        codes.push({
          code: doc.id,
          ...doc.data()
        });
      });
      
      return codes;
    } catch (error) {
      console.error('Error getting special codes:', error);
      return [];
    }
  }

  // Validasi special code saja (email divalidasi oleh Firebase Auth)
  static async validateSpecialCode(code) {
    // Try the original code first
    let data = await this.getSpecialCodeData(code);
    if (data) return true;
    
    // If not found, try the canonical name
    const canonicalName = this.getCanonicalName(code);
    if (canonicalName.toLowerCase() !== code.toLowerCase()) {
      console.log(`Trying canonical name: ${code} → ${canonicalName}`);
      data = await this.getSpecialCodeData(canonicalName.toLowerCase());
      if (data) return true;
    }
    
    return false;
  }

  // Fix existing data - convert document IDs to lowercase
  static async fixExistingData() {
    try {
      console.log('Checking and fixing existing data...');
      
      const allCodes = await this.getAllSpecialCodes();
      const fixes = [];
      
      for (const codeItem of allCodes) {
        const currentId = codeItem.code;
        const correctId = currentId.toLowerCase().replace(/\s+/g, '');
        
        if (currentId !== correctId) {
          console.log(`Fixing: "${currentId}" → "${correctId}"`);
          
          // Create new document with correct ID
          const newDocRef = doc(db, 'specialCodes', correctId);
          const oldDocRef = doc(db, 'specialCodes', currentId);
          
          // Copy data
          const data = {
            name: codeItem.name,
            active: true,
            createdAt: new Date()
          };
          
          await setDoc(newDocRef, data);
          
          // Delete old document (optional - comment out if you want to keep both)
          // await deleteDoc(oldDocRef);
          
          fixes.push({ from: currentId, to: correctId });
        }
      }
      
      if (fixes.length > 0) {
        console.log('=== DATA FIXED ===');
        fixes.forEach(fix => {
          console.log(`✅ ${fix.from} → ${fix.to}`);
        });
      } else {
        console.log('No fixes needed - all data is already correct!');
      }
      
      return fixes;
    } catch (error) {
      console.error('Error fixing data:', error);
      return [];
    }
  }

  // Create group member codes based on names (simplified)
  static async createGroupMemberCodes(memberNames) {
    try {
      console.log('Creating name entries for group members...');
      
      const results = [];
      
      for (const name of memberNames) {
        const codeId = name.toLowerCase().replace(/\s+/g, ''); // Remove spaces and make lowercase
        const docRef = doc(db, 'specialCodes', codeId);
        
        const codeData = {
          name: name,  // Just the name
          active: true,
          createdAt: new Date()
        };
        
        await setDoc(docRef, codeData);
        console.log(`✅ Created entry for ${name}: use "${codeId}" to access`);
        
        results.push({
          name: name,
          code: codeId,
          success: true
        });
      }
      
      console.log('=== GROUP MEMBER NAMES CREATED ===');
      console.log('Members can now access by entering:');
      results.forEach(result => {
        console.log(`- ${result.name} → enter "${result.code}"`);
      });
      
      return results;
    } catch (error) {
      console.error('Error creating group member names:', error);
      return [];
    }
  }

  // Create sample data if collection is empty (for development)
  static async createSampleData() {
    try {
      const sampleCodes = [
        {
          id: 'test',
          data: {
            name: 'Test Code',
            description: 'Test access code',
            active: true,
            createdAt: new Date(),
            type: 'test'
          }
        },
        {
          id: 'admin', 
          data: {
            name: 'Admin Code',
            description: 'Administrator access',
            active: true,
            createdAt: new Date(),
            type: 'admin'
          }
        },
        {
          id: 'guest',
          data: {
            name: 'Guest Code', 
            description: 'Guest access code',
            active: true,
            createdAt: new Date(),
            type: 'guest'
          }
        }
      ];

      console.log('Creating sample special codes...');
      
      for (const codeItem of sampleCodes) {
        const docRef = doc(db, 'specialCodes', codeItem.id);
        await setDoc(docRef, codeItem.data);
        console.log(`Created special code: ${codeItem.id}`);
      }
      
      console.log('Sample data created successfully!');
      return true;
    } catch (error) {
      console.error('Error creating sample data:', error);
      return false;
    }
  }

  // Get Photo1 from Peserta collection by participant name
  static async getParticipantPhoto(participantName) {
    try {
      console.log(`Fetching Photo1 for participant: ${participantName}`);
      
      // Test connection first
      console.log('Testing Firebase connection...');
      if (!db) {
        throw new Error('Firebase db not initialized');
      }
      
      // First, try to get the document from specialCodes collection (the input might be a code)
      // This will give us the actual participant reference
      const specialCodeData = await this.getSpecialCodeData(participantName);
      
      if (specialCodeData && specialCodeData.Photo1) {
        console.log('Found specialCode data with Photo1 reference:', specialCodeData);
        
        // If we have a Photo1 field in specialCodes, use it directly
        if (typeof specialCodeData.Photo1 === 'string') {
          let photoPath = specialCodeData.Photo1;
          
          // If the path doesn't end with an image extension, add Photo1.jpg
          if (!photoPath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            photoPath = photoPath.endsWith('/') ? photoPath + 'Photo1.jpg' : photoPath + '/Photo1.jpg';
          }
          
          console.log('Using Photo1 path from specialCode document:', photoPath);
          return photoPath;
        }
        
        // If Photo1 is a document reference, get the referenced document
        if (specialCodeData.Photo1.path) {
          console.log('Photo1 is a document reference, fetching:', specialCodeData.Photo1.path);
          try {
            const referencedDocSnap = await getDoc(specialCodeData.Photo1);
            console.log('Referenced document exists:', referencedDocSnap.exists());
            
            if (referencedDocSnap.exists()) {
              const referencedData = referencedDocSnap.data();
              console.log('Referenced document data:', referencedData);
              
              // If referenced document has a url field, use it directly
              if (referencedData.url) {
                console.log('Using URL from referenced document:', referencedData.url);
                return referencedData.url;
              }
              
              // If referenced document has a path field, get download URL from storage
              if (referencedData.path) {
                console.log('Getting download URL for path:', referencedData.path);
                const photoRef = ref(storage, referencedData.path);
                const photoURL = await getDownloadURL(photoRef);
                console.log('Download URL retrieved:', photoURL);
                return photoURL;
              }
              
              // If no url or path, create path based on document ID
              const docId = referencedDocSnap.id;
              const photoPath = `/Peserta/${docId}/Photo1.jpg`;
              console.log('Using document ID to create path:', photoPath);
              return photoPath;
              
            } else {
              // Referenced document doesn't exist, use the reference path as local path
              console.log('Referenced document does not exist, using reference path as local path');
              const pathParts = specialCodeData.Photo1.path.split('/');
              if (pathParts.length >= 2) {
                const participantName = pathParts[pathParts.length - 1]; // Get last part (e.g., "Denise")
                const photoPath = `/Peserta/${participantName}/Photo1.jpg`;
                console.log('Created local path from reference:', photoPath);
                return photoPath;
              }
            }
          } catch (refError) {
            console.error('Error getting referenced document:', refError);
            // Fallback: use reference path to create local path
            const pathParts = specialCodeData.Photo1.path.split('/');
            if (pathParts.length >= 2) {
              const participantName = pathParts[pathParts.length - 1];
              const photoPath = `/Peserta/${participantName}/Photo1.jpg`;
              console.log('Error fallback - created local path:', photoPath);
              return photoPath;
            }
          }
        }
      }
      
      // If no specialCode found, try to get participant name and look in Peserta collection
      let actualParticipantName = participantName;
      
      if (specialCodeData && specialCodeData.Photo1 && typeof specialCodeData.Photo1 === 'string' && specialCodeData.Photo1.includes('Peserta/')) {
        // Extract participant name from path like "/Peserta/mandagaminx/Photo1.jpg"
        const pathParts = specialCodeData.Photo1.split('/');
        const pesertaIndex = pathParts.indexOf('Peserta');
        if (pesertaIndex >= 0 && pesertaIndex + 1 < pathParts.length) {
          actualParticipantName = pathParts[pesertaIndex + 1];
          console.log(`Extracted participant name from string path: ${actualParticipantName}`);
        }
      }
      
      // Try to get the document from Peserta collection as fallback
      const docRef = doc(db, 'Peserta', actualParticipantName);
      console.log('Document reference created for Peserta lookup:', docRef.path);
      
      const docSnap = await getDoc(docRef);
      console.log('Document snapshot retrieved, exists:', docSnap.exists());
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('Participant data:', data);
        
        // Check if Photo1 document reference exists
        if (data.Photo1) {
          try {
            console.log('Photo1 field found:', data.Photo1);
            console.log('Photo1 type:', typeof data.Photo1);
            
            // If Photo1 is a Firestore document reference (has firestore property)
            if (data.Photo1 && typeof data.Photo1 === 'object' && data.Photo1.firestore) {
              console.log('Photo1 is a Firestore DocumentReference');
              console.log('Photo1 path:', data.Photo1.path);
              
              // Get the referenced document
              const referencedDocSnap = await getDoc(data.Photo1);
              if (referencedDocSnap.exists()) {
                const referencedData = referencedDocSnap.data();
                console.log('Referenced document data:', referencedData);
                
                // Return the photo URL from the referenced document
                if (referencedData.url) {
                  console.log('Found URL in referenced document:', referencedData.url);
                  return referencedData.url;
                }
                
                // If the referenced document has a storage path, get download URL
                if (referencedData.path) {
                  console.log('Found storage path in referenced document:', referencedData.path);
                  const photoRef = ref(storage, referencedData.path);
                  const photoURL = await getDownloadURL(photoRef);
                  console.log(`Got photo URL from referenced document:`, photoURL);
                  return photoURL;
                }
              } else {
                console.log('Referenced document does not exist at path:', data.Photo1.path);
              }
            }
            // If Photo1 has a path property (older style document reference)
            else if (data.Photo1.path) {
              console.log('Photo1 has path property (document reference):', data.Photo1.path);
              // Get the referenced document
              const referencedDocSnap = await getDoc(data.Photo1);
              if (referencedDocSnap.exists()) {
                const referencedData = referencedDocSnap.data();
                console.log('Referenced document data:', referencedData);
                
                // Return the photo URL from the referenced document
                if (referencedData.url) {
                  console.log('Found URL in referenced document:', referencedData.url);
                  return referencedData.url;
                }
                
                // If the referenced document has a storage path, get download URL
                if (referencedData.path) {
                  console.log('Found storage path in referenced document:', referencedData.path);
                  const photoRef = ref(storage, referencedData.path);
                  const photoURL = await getDownloadURL(photoRef);
                  console.log(`Got photo URL from referenced document:`, photoURL);
                  return photoURL;
                }
              } else {
                console.log('Referenced document does not exist at path:', data.Photo1.path);
              }
            }
            
            // If Photo1 is a direct storage reference string
            else if (typeof data.Photo1 === 'string') {
              console.log('Photo1 is a string:', data.Photo1);
              // If it's already a URL, return it
              if (data.Photo1.startsWith('http')) {
                return data.Photo1;
              }
              
              // If it's a local path, return as is
              if (data.Photo1.startsWith('/')) {
                console.log('Using local path:', data.Photo1);
                return data.Photo1;
              }
              
              // If it's a storage path, get the download URL
              try {
                const photoRef = ref(storage, data.Photo1);
                const photoURL = await getDownloadURL(photoRef);
                console.log(`Got photo URL for ${participantName}:`, photoURL);
                return photoURL;
              } catch (storageError) {
                console.log('Storage path failed, using as local path:', data.Photo1);
                return data.Photo1;
              }
            }
          } catch (photoError) {
            console.error(`Error getting photo reference for ${participantName}:`, photoError);
          }
        }
        
        // If no Photo1 reference or error occurred, fallback to local path
        console.log(`No valid Photo1 reference found for ${actualParticipantName}, using local path`);
        // Use the actual participant name for the local path
        const exactCasePath = `/Peserta/${actualParticipantName}/Photo1.jpg`;
        console.log(`Using local fallback path: ${exactCasePath}`);
        return exactCasePath;
      } else {
        console.log(`No document found for participant: ${actualParticipantName} in Peserta collection`);
        // Fallback to local photo path with actual participant name
        const exactCasePath = `/Peserta/${actualParticipantName}/Photo1.jpg`;
        console.log(`Using local fallback path: ${exactCasePath}`);
        return exactCasePath;
      }
    } catch (error) {
      console.error(`Error fetching photo for participant ${participantName}:`, error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // Fallback: try to get photo path from specialCode data
      try {
        const specialCodeData = await this.getSpecialCodeData(participantName);
        if (specialCodeData && specialCodeData.Photo1 && typeof specialCodeData.Photo1 === 'string') {
          console.log('Using Photo1 from specialCode as fallback:', specialCodeData.Photo1);
          return specialCodeData.Photo1;
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
      
      // Final fallback: use canonical name
      const fallbackName = this.getCanonicalName(participantName);
      return `/Peserta/${fallbackName}/Photo1.jpg`;
    }
  }

  // Get all participant photos for gallery
  static async getAllParticipantPhotos() {
    try {
      console.log('Fetching all participant photos...');
      
      const participantsRef = collection(db, 'Peserta');
      const querySnapshot = await getDocs(participantsRef);
      
      const photos = [];
      
      for (const doc of querySnapshot.docs) {
        const participantName = doc.id;
        const photoURL = await this.getParticipantPhoto(participantName);
        
        photos.push({
          name: participantName,
          photo: photoURL
        });
      }
      
      console.log('All participant photos fetched:', photos);
      return photos;
    } catch (error) {
      console.error('Error fetching all participant photos:', error);
      return [];
    }
  }

  // Debug function to inspect Photo1 reference structure
  static async debugParticipantDocument(participantName) {
    try {
      const canonicalName = this.getCanonicalName(participantName);
      console.log(`=== DEBUGGING PARTICIPANT DOCUMENT: ${participantName} → ${canonicalName} ===`);
      
      const docRef = doc(db, 'Peserta', canonicalName);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('Full document data:', data);
        
        if (data.Photo1) {
          console.log('Photo1 field exists:', data.Photo1);
          console.log('Photo1 type:', typeof data.Photo1);
          console.log('Photo1 constructor:', data.Photo1.constructor.name);
          
          // Check if it has a path property (document reference)
          if (data.Photo1.path) {
            console.log('Photo1 has path property:', data.Photo1.path);
            console.log('This is a Firestore DocumentReference');
          }
          
          // Check if it has other reference properties
          console.log('Photo1 properties:', Object.keys(data.Photo1));
          
          return {
            exists: true,
            data: data,
            photo1Type: typeof data.Photo1,
            photo1Constructor: data.Photo1.constructor.name,
            photo1Properties: Object.keys(data.Photo1),
            hasPath: !!data.Photo1.path
          };
        } else {
          console.log('No Photo1 field found');
          return {
            exists: true,
            data: data,
            hasPhoto1: false
          };
        }
      } else {
        console.log('Document does not exist');
        return {
          exists: false
        };
      }
    } catch (error) {
      console.error('Debug error:', error);
      return {
        error: error.message
      };
    }
  }

  // Test function to manually check a specific participant
  static async testParticipantPhoto(participantName = 'Kevin') {
    console.log(`\n=== TESTING PARTICIPANT PHOTO: ${participantName} ===`);
    
    try {
      // First debug the document structure
      const debugInfo = await this.debugParticipantDocument(participantName);
      console.log('Debug results:', debugInfo);
      
      // Then try to get the photo
      const photoURL = await this.getParticipantPhoto(participantName);
      console.log('Final photo URL:', photoURL);
      
      return {
        participantName,
        debugInfo,
        photoURL,
        success: true
      };
    } catch (error) {
      console.error('Test failed:', error);
      return {
        participantName,
        error: error.message,
        success: false
      };
    }
  }

  // Quick connectivity test
  static async quickTest() {
    console.log('🔥 FIREBASE QUICK TEST');
    console.log('Database:', db ? '✅ Connected' : '❌ Not connected');
    console.log('Storage:', storage ? '✅ Connected' : '❌ Not connected');
    
    try {
      // Test Firestore read
      console.log('\n📖 Testing Firestore read...');
      const testDoc = doc(db, 'test', 'connectivity');
      await getDoc(testDoc);
      console.log('✅ Firestore read test passed');
      
      // Test Peserta collection access
      console.log('\n👥 Testing Peserta collection access...');
      const pesertaDoc = doc(db, 'Peserta', 'Kevin');
      const pesertaSnap = await getDoc(pesertaDoc);
      console.log('Peserta/Kevin exists:', pesertaSnap.exists() ? '✅ Yes' : '❌ No');
      
      if (pesertaSnap.exists()) {
        console.log('Peserta/Kevin data:', pesertaSnap.data());
      }
      
      return true;
    } catch (error) {
      console.error('❌ Firebase test failed:', error);
      return false;
    }
  }

  // Create sample Peserta documents with Photo1 references
  static async createSamplePesertaDocuments() {
    try {
      console.log('🔄 Creating sample Peserta documents...');
      
      const participants = [
        'Kevin', 'Sarah', 'John', 'Angeline', 'Brigita', 'Cynthia', 
        'Denise', 'Ferine', 'Jgio', 'Nabila', 'navia'
      ];
      
      for (const participantName of participants) {
        console.log(`Creating document for ${participantName}...`);
        
        // Create the participant document
        const participantRef = doc(db, 'Peserta', participantName);
        
        // For now, we'll create a simple document with a Photo1 field pointing to local path
        // You can later update this to point to actual storage references
        const participantData = {
          name: participantName,
          Photo1: `/Peserta/${participantName}/Photo1.jpg`, // Local path for now
          createdAt: new Date(),
          active: true
        };
        
        await setDoc(participantRef, participantData);
        console.log(`✅ Created document for ${participantName}`);
      }
      
      console.log('🎉 All participant documents created successfully!');
      console.log('📝 To test: FirebaseService.testParticipantPhoto("Kevin")');
      
      return true;
    } catch (error) {
      console.error('❌ Error creating participant documents:', error);
      return false;
    }
  }

  // Create a specific participant with a document reference
  static async createParticipantWithDocReference(participantName, referencePath) {
    try {
      console.log(`Creating ${participantName} with document reference to ${referencePath}...`);
      
      // Create the referenced document first (e.g., the actual photo document)
      const photoDocRef = doc(db, referencePath);
      const photoData = {
        url: `/Peserta/${participantName}/Photo1.jpg`, // This could be a storage URL
        uploadedAt: new Date(),
        type: 'profile_photo'
      };
      await setDoc(photoDocRef, photoData);
      console.log(`✅ Created referenced photo document at ${referencePath}`);
      
      // Now create the participant document with a reference to the photo document
      const participantRef = doc(db, 'Peserta', participantName);
      const participantData = {
        name: participantName,
        Photo1: photoDocRef, // This is a document reference
        createdAt: new Date(),
        active: true
      };
      
      await setDoc(participantRef, participantData);
      console.log(`✅ Created participant ${participantName} with document reference`);
      
      return true;
    } catch (error) {
      console.error(`❌ Error creating ${participantName} with doc reference:`, error);
      return false;
    }
  }

  // Create a special code that references a participant's photo
  static async createSpecialCodeWithPhotoReference(codeId, participantName) {
    try {
      console.log(`Creating special code "${codeId}" that references ${participantName}'s photo...`);
      
      // Create the special code document
      const specialCodeRef = doc(db, 'specialCodes', codeId);
      const specialCodeData = {
        name: participantName, // The actual name
        Photo1: `/Peserta/${participantName}/Photo1.jpg`, // Direct path reference
        createdAt: new Date(),
        active: true,
        type: 'participant_code'
      };
      
      await setDoc(specialCodeRef, specialCodeData);
      console.log(`✅ Created special code "${codeId}" → ${participantName}`);
      
      return true;
    } catch (error) {
      console.error(`❌ Error creating special code ${codeId}:`, error);
      return false;
    }
  }

  // Batch create special codes for participants
  static async createParticipantCodes() {
    try {
      console.log('🔄 Creating participant access codes...');
      
      const codeMapping = {
        'FireSorcerer123': 'Angeline',
        'brigittaaa.f': 'Brigita',
        'mandagaminx': 'mandagaminx', // Add this mapping
        'kevin': 'Kevin',
        'cynthia': 'Cynthia',
        'denise': 'Denise',
        'ferine': 'Ferine',
        'jgio': 'Jgio',
        'nabila': 'Nabila',
        'navia': 'navia'
      };
      
      for (const [code, participant] of Object.entries(codeMapping)) {
        await this.createSpecialCodeWithPhotoReference(code, participant);
      }
      
      console.log('🎉 All participant codes created!');
      console.log('📝 Users can now enter their codes to access their photos');
      
      return true;
    } catch (error) {
      console.error('❌ Error creating participant codes:', error);
      return false;
    }
  }
  static async setupCompleteDatabase() {
    try {
      console.log('🚀 Setting up complete database...');
      
      // Step 1: Create participant access codes with photo references
      console.log('� Creating participant access codes...');
      await this.createParticipantCodes();
      
      // Step 2: Create Peserta documents (optional, for future use)
      console.log('👥 Creating Peserta documents...');
      await this.createSamplePesertaDocuments();
      
      console.log('🎉 Database setup complete!');
      console.log('✅ Users can now enter their codes to access their photos');
      console.log('✅ Photos will be loaded based on code-to-participant mapping');
      console.log('');
      console.log('🧪 Test commands:');
      console.log('FirebaseService.testParticipantPhoto("FireSorcerer123") // Should show Angeline');
      console.log('FirebaseService.testParticipantPhoto("brigittaaa.f") // Should show Brigita');
      console.log('FirebaseService.quickTest()');
      
      return true;
    } catch (error) {
      console.error('❌ Database setup failed:', error);
      return false;
    }
  }
}