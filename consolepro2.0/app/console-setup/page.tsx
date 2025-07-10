'use client';
import React, { useState } from 'react';

export default function ConsoleSetupPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const setupConsoleDiscountSheets = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch('/api/setup-console-discount-sheets', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.error || 'Failed to set up console discount sheets');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      padding: '32px 0',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '32px',
          color: '#f8fafc',
          textAlign: 'center'
        }}>
          Console Discount Code System Setup
        </h1>

        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          borderRadius: '18px',
          boxShadow: '0 6px 32px rgba(0, 0, 0, 0.3)',
          padding: '32px',
          marginBottom: '24px',
          border: '1px solid rgba(148, 163, 184, 0.2)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '16px',
            color: '#38bdf8'
          }}>
            Set Up Google Sheets Structure
          </h2>
          
          <p style={{
            color: '#cbd5e1',
            marginBottom: '24px',
            lineHeight: '1.6'
          }}>
            This will create the necessary sheets in your Google Spreadsheet for managing console discount codes:
          </p>

          <ul style={{
            color: '#cbd5e1',
            marginBottom: '24px',
            lineHeight: '1.6',
            paddingLeft: '20px'
          }}>
            <li><strong>ConsoleDiscountCodes</strong> - Stores all console discount code information</li>
            <li><strong>ConsoleDiscountCodeUsage</strong> - Tracks when and how console discount codes are used</li>
          </ul>

          <div style={{
            background: 'rgba(51, 65, 85, 0.5)',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid rgba(148, 163, 184, 0.2)'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#f1f5f9' }}>Sample Code: CONSOLE10</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#cbd5e1' }}>
              <li>10% discount on orders over $50</li>
              <li>Maximum discount of $100</li>
              <li>Can be used 50 times</li>
              <li>Valid for 90 days</li>
            </ul>
          </div>

          <button
            onClick={setupConsoleDiscountSheets}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#475569' : '#38bdf8',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? 'Setting up...' : 'Set Up Console Discount Sheets'}
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            color: '#fca5a5'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {results.length > 0 && (
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '18px',
            boxShadow: '0 6px 32px rgba(0, 0, 0, 0.3)',
            padding: '32px',
            border: '1px solid rgba(148, 163, 184, 0.2)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#10b981'
            }}>
              Setup Results
            </h2>
            
            <div style={{
              background: 'rgba(51, 65, 85, 0.5)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              {results.map((result, index) => (
                <div key={index} style={{
                  padding: '8px 0',
                  borderBottom: index < results.length - 1 ? '1px solid rgba(148, 163, 184, 0.2)' : 'none',
                  color: '#cbd5e1'
                }}>
                  {result}
                </div>
              ))}
            </div>

            {results.some(r => r.includes('✅')) && (
              <div style={{
                marginTop: '24px',
                padding: '16px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#6ee7b7' }}>
                  🎉 Setup Complete!
                </h3>
                <p style={{ margin: 0, color: '#a7f3d0' }}>
                  Your console discount code system is now ready to use. You can:
                </p>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: '#a7f3d0' }}>
                  <li>Go to <a href="/?section=discount-codes" style={{ color: '#38bdf8' }}>Discount Codes</a> in your console to manage codes</li>
                  <li>Test the system by using the sample code CONSOLE10</li>
                  <li>Create additional discount codes as needed</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 