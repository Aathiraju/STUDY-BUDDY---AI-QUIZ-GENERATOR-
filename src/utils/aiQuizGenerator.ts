import { Question, QuizSettings, DifficultyLevel, QuestionType, DocumentItem } from '../types';

export const SAMPLE_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc_networking',
    name: 'Computer_Networks_Chapter4_OSI_Model.pdf',
    type: 'pdf',
    text: `Chapter 4: The OSI Model and Network Protocols

The Open Systems Interconnection (OSI) model is a conceptual framework that standardizes the functions of a telecommunication or computing system into seven distinct layers. 

Layer 7: Application Layer
The Application Layer provides network services directly to end-user applications. Key protocols include HTTP, HTTPS, FTP, and SMTP. It is responsible for user authentication and data presentation to software apps.

Layer 6: Presentation Layer
The Presentation Layer formats and translates data for the application layer. It handles encryption, compression, and data format conversions (such as ASCII, JPEG, and SSL/TLS encryption).

Layer 5: Session Layer
The Session Layer manages sessions between computers. It sets up, coordinates, and terminates connections between local and remote applications.

Layer 4: Transport Layer
The Transport Layer provides end-to-end data transfer services and error recovery. The two primary protocols operating at this layer are TCP (Transmission Control Protocol) and UDP (User Datagram Protocol). TCP is connection-oriented, reliable, and uses a three-way handshake (SYN, SYN-ACK, ACK), while UDP is connectionless, faster, but does not guarantee packet delivery.

Layer 3: Network Layer
The Network Layer handles packet routing across multiple networks using Internet Protocol (IP) addressing. IPv4 uses 32-bit addresses, whereas IPv6 uses 128-bit addresses to overcome IP exhaustion. Routers operate primarily at Layer 3.

Layer 2: Data Link Layer
The Data Link Layer provides node-to-node transfer across a single physical network segment. It handles Media Access Control (MAC) addressing, frame synchronization, and error detection using Cyclic Redundancy Check (CRC). Switches operate at Layer 2.

Layer 1: Physical Layer
The Physical Layer transmits raw binary bits over a physical medium (copper cabling, fiber optics, or wireless radio frequencies). Hubs and repeaters operate at this layer.

Key Formulas and Rules:
- Throughput = (Data Volume) / (Time Taken)
- Round Trip Time (RTT) affects TCP throughput: Max Throughput <= Window Size / RTT.
- Subnet Masking: /24 subnet provides 254 usable IP addresses (2^8 - 2).`,
    pageCount: 14,
    estimatedReadingTimeMinutes: 8,
    uploadDate: '2026-08-04',
    fileSizeFormatted: '2.4 MB',
    previewSnippet: 'The Open Systems Interconnection (OSI) model is a conceptual framework that standardizes the functions of a telecommunication system into 7 distinct layers...',
  },
  {
    id: 'doc_dbms',
    name: 'Database_Management_Systems_SQL.pdf',
    type: 'pdf',
    text: `Database Management Systems (DBMS) & Normalization

A Database Management System (DBMS) is software designed to store, retrieve, and manage data systematically. Relational DBMS (RDBMS) structures data in tables composed of rows (tuples) and columns (attributes).

ACID Properties of Transactions:
1. Atomicity: Guarantees that all operations within a transaction complete successfully; if any operation fails, the entire transaction is rolled back.
2. Consistency: Ensures that data transitions from one valid state to another, upholding all schema constraints and foreign key rules.
3. Isolation: Ensures that concurrent transactions execute independently without interfering with each other's intermediate state.
4. Durability: Guarantees that once a transaction commits, its changes persist permanently even in the event of a system crash.

Database Normalization Levels:
- First Normal Form (1NF): Eliminates repeating groups and ensures attributes contain only atomic (indivisible) values.
- Second Normal Form (2NF): Meets 1NF requirements and eliminates partial functional dependencies (all non-key attributes must depend on the full primary key).
- Third Normal Form (3NF): Meets 2NF requirements and eliminates transitive dependencies (non-key attributes must not depend on other non-key attributes).
- Boyce-Codd Normal Form (BCNF): A stricter version of 3NF where every determinant must be a super key.

Indexing and B-Trees:
B-Trees and B+ Trees are self-balancing search trees widely used for database indexing. B+ trees store all actual data pointers in leaf nodes connected as a linked list, optimizing range queries.`,
    pageCount: 18,
    estimatedReadingTimeMinutes: 11,
    uploadDate: '2026-08-05',
    fileSizeFormatted: '3.8 MB',
    previewSnippet: 'A Database Management System (DBMS) is software designed to store, retrieve, and manage data systematically. Relational DBMS structures data in tables...',
  }
];

export function generateQuizFromText(
  documentText: string,
  settings: QuizSettings,
  docName: string = 'Uploaded Document'
): Question[] {
  const lines = documentText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const questions: Question[] = [];
  const requestedCount = settings.questionCount || 10;
  const typesToUse = settings.questionTypes.length > 0 ? settings.questionTypes : ['multiple_choice', 'true_false'];

  // Identify key sentences and paragraphs for question generation
  const keySentences = documentText
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25);

  let qIndex = 1;

  for (let i = 0; i < Math.min(requestedCount, 50); i++) {
    const selectedType = typesToUse[i % typesToUse.length];
    const sentence = keySentences[i % keySentences.length] || `The document contains key concepts regarding ${docName}.`;
    const pageNum = Math.floor(i / 3) + 1;

    if (selectedType === 'multiple_choice') {
      if (sentence.includes('OSI') || documentText.includes('OSI')) {
        interface MCQPoolItem {
          q: string;
          options: string[];
          correct: string;
          exp: string;
          ref: string;
          concept: string;
          whyWrong: Record<string, string>;
        }

        const mcqPool: MCQPoolItem[] = [
          {
            q: 'Which layer of the OSI model handles data encryption, SSL/TLS, and format conversions?',
            options: ['Application Layer (Layer 7)', 'Presentation Layer (Layer 6)', 'Session Layer (Layer 5)', 'Transport Layer (Layer 4)'],
            correct: 'Presentation Layer (Layer 6)',
            exp: 'Layer 6 (Presentation) formats and translates data for the application layer. It handles encryption, compression, and conversions like ASCII and SSL/TLS.',
            ref: 'Layer 6: Presentation Layer formats and translates data... handles encryption, compression, and data format conversions.',
            concept: 'OSI Model Layers',
            whyWrong: {
              'Application Layer (Layer 7)': 'Layer 7 provides services directly to end-user software like HTTP/FTP.',
              'Session Layer (Layer 5)': 'Layer 5 manages connection sessions between hosts.',
              'Transport Layer (Layer 4)': 'Layer 4 handles end-to-end data transfer and error recovery (TCP/UDP).'
            }
          },
          {
            q: 'What three-way handshake mechanism does TCP use to establish a connection at Layer 4?',
            options: ['SYN, SYN-ACK, ACK', 'RST, FIN, ACK', 'CONNECT, ACCEPT, CONFIRM', 'PING, PONG, ACK'],
            correct: 'SYN, SYN-ACK, ACK',
            exp: 'TCP establishes reliable connection-oriented communication using SYN (Synchronize), SYN-ACK (Synchronize-Acknowledge), and ACK (Acknowledge).',
            ref: 'TCP is connection-oriented, reliable, and uses a three-way handshake (SYN, SYN-ACK, ACK).',
            concept: 'Transport Layer Protocols',
            whyWrong: {
              'RST, FIN, ACK': 'RST and FIN are used to reset or terminate connections, not open them.',
              'CONNECT, ACCEPT, CONFIRM': 'These are generic software terms, not TCP flags.',
              'PING, PONG, ACK': 'PING/PONG are ICMP and WebSocket heartbeat mechanisms.'
            }
          },
          {
            q: 'Which networking device operates primarily at Layer 3 (Network Layer) using IP addresses?',
            options: ['Router', 'Switch', 'Hub', 'Repeater'],
            correct: 'Router',
            exp: 'Routers operate at Layer 3 (Network Layer) to route packets across different logical networks using IP addressing.',
            ref: 'The Network Layer handles packet routing using IP addressing. Routers operate primarily at Layer 3.',
            concept: 'Network Infrastructure Devices',
            whyWrong: {
              'Switch': 'Switches operate at Layer 2 (Data Link) using MAC addresses.',
              'Hub': 'Hubs operate at Layer 1 (Physical) broadcasting bits to all ports.',
              'Repeater': 'Repeaters amplify signals at Layer 1 (Physical).'
            }
          },
          {
            q: 'In IPv4 vs IPv6 addressing, how many bits are utilized by IPv6 addresses?',
            options: ['128 bits', '32 bits', '64 bits', '256 bits'],
            correct: '128 bits',
            exp: 'IPv6 uses 128-bit addresses to vastly expand the available address space compared to IPv4 32-bit addresses.',
            ref: 'IPv4 uses 32-bit addresses, whereas IPv6 uses 128-bit addresses to overcome IP exhaustion.',
            concept: 'IP Addressing Architecture',
            whyWrong: {
              '32 bits': '32 bits is the length of IPv4 addresses.',
              '64 bits': '64 bits is standard for MAC addresses (EUI-64) or memory bus architecture.',
              '256 bits': '256 bits is commonly used in cryptographic hash keys (SHA-256).'
            }
          }
        ];

        const item = mcqPool[i % mcqPool.length];
        questions.push({
          id: `q_${qIndex++}`,
          type: 'multiple_choice',
          question: item.q,
          options: item.options,
          correctAnswer: item.correct,
          explanation: item.exp,
          referenceSnippet: item.ref,
          pageNumber: pageNum,
          relatedConcept: item.concept,
          whyWrongOptions: item.whyWrong,
        });
      } else if (sentence.includes('Database') || sentence.includes('ACID') || documentText.includes('ACID')) {
        interface DBPoolItem {
          q: string;
          options: string[];
          correct: string;
          exp: string;
          ref: string;
          concept: string;
          whyWrong: Record<string, string>;
        }

        const dbPool: DBPoolItem[] = [
          {
            q: 'Which ACID property guarantees that all operations in a transaction complete or none do?',
            options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
            correct: 'Atomicity',
            exp: 'Atomicity treats a transaction as a single atomic unit of work: either all steps succeed or everything is rolled back.',
            ref: 'Atomicity guarantees that all operations within a transaction complete successfully; if any operation fails, the entire transaction is rolled back.',
            concept: 'ACID Transaction Guarantees',
            whyWrong: {
              'Consistency': 'Consistency ensures schema constraints and valid state transitions.',
              'Isolation': 'Isolation prevents concurrent transactions from seeing uncommitted changes.',
              'Durability': 'Durability ensures committed changes survive power loss or crashes.'
            }
          },
          {
            q: 'What is required for a database schema to satisfy Second Normal Form (2NF)?',
            options: [
              'Must be in 1NF and eliminate partial functional dependencies',
              'Must eliminate transitive dependencies',
              'Must allow non-atomic multi-valued attributes',
              'Must enforce foreign keys on all non-primary fields'
            ],
            correct: 'Must be in 1NF and eliminate partial functional dependencies',
            exp: '2NF requires satisfying 1NF and ensuring every non-prime attribute is fully dependent on the whole primary key.',
            ref: 'Second Normal Form (2NF): Meets 1NF requirements and eliminates partial functional dependencies.',
            concept: 'Database Normalization',
            whyWrong: {
              'Must eliminate transitive dependencies': 'Transitive dependency removal is required for 3NF.',
              'Must allow non-atomic multi-valued attributes': 'Non-atomic attributes violate 1NF.',
              'Must enforce foreign keys on all non-primary fields': 'Foreign keys enforce referential integrity, not 2NF.'
            }
          }
        ];
        const item = dbPool[i % dbPool.length];
        questions.push({
          id: `q_${qIndex++}`,
          type: 'multiple_choice',
          question: item.q,
          options: item.options,
          correctAnswer: item.correct,
          explanation: item.exp,
          referenceSnippet: item.ref,
          pageNumber: pageNum,
          relatedConcept: item.concept,
          whyWrongOptions: item.whyWrong,
        });
      } else {
        // Generic dynamic question generated from sentence
        const words = sentence.split(' ');
        const keyWord = words.find((w) => w.length > 5) || 'concept';
        questions.push({
          id: `q_${qIndex++}`,
          type: 'multiple_choice',
          question: `Based on the uploaded document, which statement correctly describes "${keyWord}"?`,
          options: [
            sentence,
            `It contradicts the core principle of ${keyWord} discussed in section ${pageNum}.`,
            `It only applies in legacy systems and is omitted in modern implementations.`,
            `It represents an unverified theoretical hypothesis.`
          ],
          correctAnswer: sentence,
          explanation: `According to page ${pageNum} of the source document, "${sentence}" accurately summarizes this core concept.`,
          referenceSnippet: sentence,
          pageNumber: pageNum,
          relatedConcept: `${keyWord.charAt(0).toUpperCase() + keyWord.slice(1)} Analysis`,
          whyWrongOptions: {
            'It contradicts the core principle...': 'The text explicitly confirms this principle without contradiction.',
            'It only applies in legacy systems...': 'The document does not restrict this to legacy implementations.',
            'It represents an unverified...': 'The text states this as an established rule/definition.'
          }
        });
      }
    } else if (selectedType === 'true_false') {
      const isTrue = i % 2 === 0;
      const statement = isTrue
        ? sentence
        : sentence.replace(' is ', ' is NOT ').replace(' provides ', ' fails to provide ');
      
      questions.push({
        id: `q_${qIndex++}`,
        type: 'true_false',
        question: `True or False: ${statement}`,
        options: ['True', 'False'],
        correctAnswer: isTrue ? 'True' : 'False',
        explanation: isTrue
          ? `True. The document states: "${sentence}"`
          : `False. The document explicitly affirms the opposite: "${sentence}"`,
        referenceSnippet: sentence,
        pageNumber: pageNum,
        relatedConcept: 'Fact Verification',
      });
    } else if (selectedType === 'fill_in_blanks') {
      const words = sentence.split(' ');
      const targetIndex = Math.floor(words.length / 2);
      const blankWord = words[targetIndex] || 'protocol';
      const questionText = sentence.replace(blankWord, '________');

      questions.push({
        id: `q_${qIndex++}`,
        type: 'fill_in_blanks',
        question: `Fill in the blank: "${questionText}"`,
        correctAnswer: blankWord.replace(/[.,;:]/g, ''),
        explanation: `The missing key term is "${blankWord}", completing the statement in the document.`,
        referenceSnippet: sentence,
        pageNumber: pageNum,
        relatedConcept: 'Terminology Recall',
      });
    } else {
      // Short answer
      questions.push({
        id: `q_${qIndex++}`,
        type: 'short_answer',
        question: `Explain the significance of the following concept mentioned on Page ${pageNum}: "${sentence.slice(0, 70)}..."`,
        correctAnswer: sentence,
        explanation: `A comprehensive answer should state: ${sentence}`,
        referenceSnippet: sentence,
        pageNumber: pageNum,
        relatedConcept: 'Conceptual Synthesis',
      });
    }
  }

  // Handle difficulty adjustment
  if (settings.difficulty === 'hard') {
    questions.forEach((q) => {
      q.question = `[Advanced Analysis] ${q.question}`;
    });
  } else if (settings.difficulty === 'easy') {
    questions.forEach((q) => {
      q.question = `[Fundamentals] ${q.question}`;
    });
  }

  return questions;
}
