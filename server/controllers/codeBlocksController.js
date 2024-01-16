const CodeBlock = require('../models/CodeBlock')

module.exports = {

    getAllCodeBlocks: async (req, res) => {

      try {
        const codeBlocks = await CodeBlock.find().exec();
        //console.log('Fetched code blocks:', codeBlocks);
        res.json(codeBlocks);
      } catch (error) {
        console.error('Error fetching code blocks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }, 

    getCodeBlockById: async (req, res) => {
      const codeBlockId = req.params.blockId;
    try {
    // Check if the code block ID exists in the database
    //console.log('Start fetching code blocks', codeBlockId);
    const codeBlock = await CodeBlock.findById(codeBlockId).exec();

    if (codeBlock) {
      //console.log('Fetched code block:', codeBlock); 
      res.json(codeBlock);
    } else {
      console.log('Code block not found');
      res.status(404).json({ error: 'Code block not found' });
    }
    } catch (error) {
      console.error('Error fetching code blocks:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    }, 

    checkSolution: async (req, res) => {
    const codeBlockId = req.params.blockId;
    const userCode = req.body.code;
    console.log(userCode)
    //string without new line characters, white spaces, non-breaking space
    const cleanUserCode = userCode.replace(/[\s\r\n]/g, '').replace(/\u00A0/g, ''); 
    console.log(cleanUserCode)

  
    try {  
      const codeBlock = await CodeBlock.findById(codeBlockId).exec();
  
      if (codeBlock) {
        const solutionCode = codeBlock.solutionCode;
        console.log(solutionCode)

        const cleanSolutionCode = solutionCode.replace(/[\s\r\n]/g, '').replace(/\u00A0/g, '');
        console.log(cleanSolutionCode)
        
  
        if (cleanUserCode === cleanSolutionCode) {
          res.status(200).json({ result: 'Correct!' });
        } else {
          res.status(200).json({ result: 'Incorrect!' });
        }
      } else {
        res.status(404).json({ error: 'Code block not found' });
      }
    } catch (error) {
      console.log('Error checking solution:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } 
    },
    sayHello: (req, res) => {
      res.status(404).json({message: "hello"});
    }
}
