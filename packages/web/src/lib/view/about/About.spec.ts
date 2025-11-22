import '@testing-library/jest-dom/vitest'

import { render, screen, within } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'

import About from './About.svelte'
import type { AboutSection } from './types'

vi.mock('$app/paths', () => ({
  resolve: (path: string) => path,
}))

const sections: readonly AboutSection[] = [
  {
    id: 'overview',
    title: '概要',
    lead: 'ツール全体の利用目的を概説します。',
    body: [
      '本ツールはアセンブルの検討と共有を支援します。',
      '組み合わせの比較を高速に行えるように設計されています。',
    ],
  },
  {
    id: 'features',
    title: '主な機能',
    lead: '利用者が着目すべき主要機能のまとめです。',
    body: ['アセンブル保存、共有リンク生成、性能比較などを備えています。'],
  },
] as const

const baseProps = {
  sections,
  heroTitle: 'AC6 ASSEMBLE TOOL /about',
  heroLead: '本ツールの目的と活用方法を紹介します。',
  backLinkLabel: 'ホームへ戻る',
  tocNavigationLabel: 'セクション一覧',
  tocHeadingLabel: 'セクション',
}

const renderAbout = (props: Partial<typeof baseProps> = {}) =>
  render(About, {
    props: {
      ...baseProps,
      ...props,
    },
  })

describe(About.name, () => {
  it('プロップ依存性: セクションの内容を入力通りに描画する', () => {
    const { container } = renderAbout()

    sections.forEach((section) => {
      const sectionElement = container.querySelector(`#${section.id}`)
      expect(sectionElement).not.toBeNull()
      expect(
        screen.getByRole('heading', { level: 2, name: section.title }),
      ).toBeInTheDocument()
      expect(screen.getByText(section.lead)).toBeInTheDocument()
      section.body.forEach((paragraph) => {
        expect(screen.getByText(paragraph)).toBeInTheDocument()
      })
    })
  })

  it('ヒーローブロック: タイトルとリード文を強調スタイルで表示する', () => {
    renderAbout()

    const heroTitle = screen.getByRole('heading', {
      level: 1,
      name: baseProps.heroTitle,
    })
    expect(heroTitle.classList.contains('display-5')).toBe(true)
    expect(heroTitle.classList.contains('fw-bold')).toBe(true)

    const heroLead = screen.getByText(baseProps.heroLead)
    expect(heroLead.classList.contains('lead')).toBe(true)
    expect(heroLead.classList.contains('fs-4')).toBe(true)
  })

  it('セクション目次: 目次ナビゲーションとアンカーリンクを生成する', () => {
    renderAbout()

    const tocNav = screen.getByRole('navigation', {
      name: baseProps.tocNavigationLabel,
    })
    const heading = within(tocNav).getByRole('heading', {
      level: 2,
      name: baseProps.tocHeadingLabel,
    })
    expect(heading).toBeInTheDocument()

    sections.forEach((section) => {
      const tocLink = within(tocNav).getByRole('link', { name: section.title })
      expect(tocLink.getAttribute('href')).toBe(`#${section.id}`)
    })
  })
})
