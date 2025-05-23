// Dyslexia overall performance pdf
import React, { useEffect, useState, useRef } from 'react'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function DysRecordPdf({ record, closeWindow }) {
    const pdfContentRef = useRef(null);

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
            pdf.save(`Quiz-${record?.id}-Feedback.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center'>
            <div
                ref={pdfContentRef}
                className="relative py-4 px-8 pdf-generator-container la-container pdf-content h-fit "
                style={{
                    width: '794px',
                    minHeight: '1123px',
                    fontFamily: 'Arial, sans-serif',
                }}
            >

                <i className='fa-solid fa-chevron-left absolute top-2 left-2 cursor-pointer' onClick={closeWindow}></i>
                {/* Header Section */}
                <div className="border-b-2 border-gray-200 pb-4 mb-6">
                    <h1 className="text-3xl font-bold mb-2">{record.name}</h1>
                    <div className="flex justify-between text-sm text-gray-600">
                        <p>Date: {record.date}</p>
                        <p>ID: {record.id?.substring(0, 6)}</p>
                    </div>
                </div>

                {/* Score Overview */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <h3 className="font-semibold mb-2">Total Score</h3>
                        <p className="text-2xl font-bold">{record.totalScore}/{record.maxPossibleScore}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <h3 className="font-semibold mb-2">Average Accuracy</h3>
                        <p className="text-2xl font-bold">{record.summary.averageAccuracy}%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <h3 className="font-semibold mb-2">Time Spent</h3>
                        <p className="text-2xl font-bold">{Math.floor(record.timeSpent / 60)}m {record.timeSpent % 60}s</p>
                    </div>
                </div>

                {/* Chapter Performance */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Chapter Performance</h2>
                    {record.chapter_performance.map((chapter, index) => (
                        <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between mb-2">
                                <h3 className="font-semibold">Chapter {index + 1}</h3>
                                <span className="text-sm">{chapter.completedAt}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-2">
                                <p><span className="font-semibold">Original:</span> {chapter.chapter}</p>
                                <p><span className="font-semibold">Pronounced:</span> {chapter.userPronounced}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <p><span className="font-semibold">Score:</span> {chapter.score}</p>
                                <p><span className="font-semibold">Accuracy:</span> {chapter.accuracy}%</p>
                                <p><span className="font-semibold">Attempts:</span> {chapter.attempts}</p>
                            </div>
                            {chapter.mistakes.length > 0 && (
                                <div className="mt-2">
                                    <p className="font-semibold">Mistakes:</p>
                                    <ul className="list-disc list-inside text-sm">
                                        {chapter.mistakes.map((mistake, idx) => (
                                            <li key={idx}>{mistake}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Summary Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Performance Summary</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="mb-2"><span className="font-semibold">Total Chapters:</span> {record.summary.totalChapters}</p>
                            <p className="mb-2"><span className="font-semibold">Completed:</span> {record.summary.completedChapters}</p>
                            <p className="mb-2"><span className="font-semibold">Strongest Chapter:</span> {record.summary.strongestChapter}</p>
                            <p className="mb-2"><span className="font-semibold">Weakest Chapter:</span> {record.summary.weakestChapter}</p>
                        </div>
                        {record.summary.improvementAreas.length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-2">Areas for Improvement</h3>
                                <ul className="list-disc list-inside text-sm">
                                    {record.summary.improvementAreas.map((area, index) => (
                                        <li key={index}>{area}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

            </div>
            <div className='flex w-full justify-center items-center mt-2'>
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
                    Download Report
                </button>
            </div>
        </div>

    )
}