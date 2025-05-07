import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import './globals.css';
import { Layout } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Solace ',
  description: 'How does this look?',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-screen`}>
        <AntdRegistry>
          <Layout>
            <Header>Solace</Header>
            <Layout>
              <Content className='px-8 pt-8'>{children}</Content>
            </Layout>
            <Footer style={{ textAlign: 'center' }}>
              Solace ©{new Date().getFullYear()} 
            </Footer>
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
}
