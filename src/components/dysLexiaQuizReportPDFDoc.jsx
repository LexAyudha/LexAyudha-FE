import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../assets/lexLogo.png';



const DysLexiaQuizReportPDFDoc = ({ quizEvalnObj, closeWindow }) => {
    const pdfContentRef = useRef(null);
    console.log('Quiz Eval: ', quizEvalnObj)

    const generatePDF = async () => {
        if (!pdfContentRef.current) return;

        try {
            // Get the element to capture
            const element = pdfContentRef.current;

            // Create canvas from the element
            const canvas = await html2canvas(element, {
                scale: 2, // Higher quality
                useCORS: true,
                allowTaint: true,

                width: element.scrollWidth,
                height: element.scrollHeight,
            });

            // Calculate dimensions for A4
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pdfWidth = 210; // A4 width in mm
            const pdfHeight = 297; // A4 height in mm
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            // Handle multiple pages if content is too tall
            let heightLeft = imgHeight;
            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            // Add additional pages if needed
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            // Save the PDF
            pdf.save(`Quiz-${quizEvalnObj}-Feedback.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    const closePreview = () => {
        closeWindow(false)
    }

    return (
        <div className="pdf-generator-container h-full overflow-auto py-12 flex justify-center  ">
            <div
                ref={pdfContentRef}
                className="la-container pdf-content w-[794px] min-h-[1123px] h-fit p-[40px] relative bg-[var(--background-color)]"
                style={{
                    width: '794px', // A4 width in pixels (210mm * 3.78)
                    minHeight: '1123px', // A4 height in pixels (297mm * 3.78)
                    padding: '40px',
                    fontFamily: 'Arial, sans-serif',
                    position: 'relative',
                }}
            >
                {/* Header Section */}
                <div
                    className='flex items-center mb-[30px] border-b-[1px] border-[var(--text-color)] pb-[15px]'

                >
                    <img
                        src={logo}
                        alt="LexAyudha Logo"
                        style={{
                            width: '50px',
                            height: '50px',
                        }}
                    />
                    <h1
                        className='ml-[15px] text-[24px] font-bold text-[var(--text-color)]'

                    >
                        LexAyudha
                    </h1>
                </div>

                <div className="mb-8 border-b border-[var(--text-color)] pb-4">
                    <h1 className="text-2xl font-bold mb-2">{quizEvalnObj.name}</h1>
                    <div className="flex justify-between text-sm">
                        <p>Date: {quizEvalnObj.date}</p>
                        <p>Quiz ID: {quizEvalnObj.id}</p>
                    </div>
                </div>

                {/* Score Overview */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-black bg-opacity-5 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Total Score</h3>
                        <p className="text-2xl">{quizEvalnObj.totalScore}/{quizEvalnObj.maxPossibleScore}</p>
                    </div>
                    <div className="bg-black bg-opacity-5 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Accuracy</h3>
                        <p className="text-2xl">{quizEvalnObj.summary.averageAccuracy}%</p>
                    </div>
                    <div className="bg-black bg-opacity-5 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Chapters Completed</h3>
                        <p className="text-2xl">{quizEvalnObj.summary.completedChapters}/{quizEvalnObj.summary.totalChapters}</p>
                    </div>
                </div>

                {/* Chapter Performance */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Chapter Performance</h2>
                    <div className="space-y-4">
                        {quizEvalnObj.chapter_performance.map((chapter, index) => (
                            <div key={index} className="bg-black bg-opacity-5 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold">Chapter {index + 1}</h3>
                                    <span className="text-sm">Score: {chapter.score}/10</span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p>Original: {chapter.chapter}</p>
                                    <p>Pronounced: {chapter.userPronounced}</p>
                                    <p>Accuracy: {chapter.accuracy}%</p>
                                    {chapter.mistakes.length > 0 && (
                                        <div>
                                            <p className="font-semibold">Mistakes:</p>
                                            <ul className="list-disc list-inside">
                                                {chapter.mistakes.map((mistake, idx) => (
                                                    <li key={idx}>{mistake}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Section */}
                <div className="bg-black bg-opacity-5 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Performance Summary</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-2">Strongest Chapter</h3>
                            <p>{quizEvalnObj.summary.strongestChapter}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Weakest Chapter</h3>
                            <p>{quizEvalnObj.summary.weakestChapter}</p>
                        </div>
                    </div>
                    {quizEvalnObj.summary.improvementAreas.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Areas for Improvement</h3>
                            <ul className="list-disc list-inside">
                                {quizEvalnObj.summary.improvementAreas.map((area, index) => (
                                    <li key={index}>{area}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            {/* Generate PDF Button */}
            <div className='h-screen flex flex-col space-y-4 items-center justify-center pl-10'>
                <button
                    onClick={generatePDF}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#1574F9',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        fontWeight: '500',
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#0d5cbf';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#1574F9';
                    }}
                >
                    Download PDF
                </button>
                <button
                    onClick={closePreview}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#1574F9',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        fontWeight: '500',
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#0d5cbf';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#1574F9';
                    }}
                >
                    Close Preview
                </button>
            </div>

        </div>
    );
};

export default DysLexiaQuizReportPDFDoc;