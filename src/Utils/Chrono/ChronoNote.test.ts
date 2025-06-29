import fs from 'fs'
import { DateTime } from 'luxon'
import { ChronoNote, ChronoType, Interval, Ordinal } from './ChronoNote.js'
import { FileProvider, IFileProvider } from '../File/FileProvider.js'

jest.mock('fs')

describe('ChronoNote', () => {
  const readFileSyncMock = fs.readFileSync as jest.Mock

  let fileProvider = {} as IFileProvider
  const opts = { locale: 'en-US' }

  beforeEach(() => {
    fileProvider = new FileProvider()
  })

  test('fileProvider should be defined', () => {
    expect(fileProvider).toBeDefined()
  })

  it('should create a ChronoNote based on given ChronoType', () => {
    const expectedChronoType: ChronoType = {
      interval: Interval.Daily,
      ordinal: Ordinal.Current,
    }
    const note = new ChronoNote(expectedChronoType, fileProvider)
    expect(note.getInterval()).toEqual(expectedChronoType.interval)
    expect(note.getOrdinal()).toEqual(expectedChronoType.ordinal)
  })

  it('should create a ChronoNote with the default date as now', () => {
    const expectedWeekYear = DateTime.now().localWeekYear

    const expectedChronoType: ChronoType = {
      interval: Interval.Daily,
      ordinal: Ordinal.Current,
    }
    const note = new ChronoNote(expectedChronoType, fileProvider)
    expect(note.getDate().localWeekYear).toEqual(expectedWeekYear)
  })

  describe('getTemplate', () => {
    it('should return the template content for the given file path', () => {
      // Setup
      const expectedTemplateContent = 'template content'
      const expectedChronoType: ChronoType = {
        interval: Interval.Daily,
        ordinal: Ordinal.Current,
      }
      const note = new ChronoNote(expectedChronoType, fileProvider)

      readFileSyncMock.mockReturnValue(expectedTemplateContent)

      // Execute
      const actualResult = note.getTemplate('template file path')

      // Verify
      expect(actualResult).toEqual(expectedTemplateContent)
    })
  })

  describe('formatDate', () => {
    it('should format a datetime when date token is valid', () => {
      // Setup
      const testFormatToken = 'yyyy-MM-dd cccc'
      const note = new ChronoNote(
        { interval: Interval.Daily, ordinal: Ordinal.Current },
        fileProvider,
      )

      // Execute
      const actualResult = note.formatDate(testFormatToken)

      // Verify
      expect(actualResult).toEqual(DateTime.now().toFormat(testFormatToken))
    })
  })

  describe('formatDayDate', () => {
    const chronoTypeInput: ChronoType = {
      interval: Interval.Daily,
      ordinal: Ordinal.Current,
    }

    const cases = [
      [DateTime.local(2024, 1, 1, opts), '2024-01-01 Monday'],
      [DateTime.local(2024, 1, 7, opts), '2024-01-07 Sunday'],
      [DateTime.local(2024, 1, 27, opts), '2024-01-27 Saturday'],
      [DateTime.local(2024, 1, 29, opts), '2024-01-29 Monday'],
      [DateTime.local(2024, 2, 4, opts), '2024-02-04 Sunday'],
      [DateTime.local(2024, 2, 29, opts), '2024-02-29 Thursday'],
      [DateTime.local(2024, 3, 1, opts), '2024-03-01 Friday'],
      [DateTime.local(2024, 3, 30, opts), '2024-03-30 Saturday'],
      [DateTime.local(2024, 3, 31, opts), '2024-03-31 Sunday'],
      [DateTime.local(2024, 12, 22, opts), '2024-12-22 Sunday'],
      [DateTime.local(2024, 12, 28, opts), '2024-12-28 Saturday'],
    ]

    test.each(cases)(
      'given %p DateTime, expect %p date string',
      (givenDate, expectedResult) => {
        const chronoNote = new ChronoNote(
          chronoTypeInput,
          fileProvider,
          givenDate as DateTime,
        )
        const result = chronoNote.formatDayDate()
        expect(result).toEqual(expectedResult)
      },
    )
  })

  describe('formatWeekDate', () => {
    const cases = [
      [DateTime.local(2024, 1, 1, opts), '2024-W01'],
      [DateTime.local(2024, 2, 4, opts), '2024-W06'],
      [DateTime.local(2024, 12, 22, opts), '2024-W52'],
      [DateTime.local(2025, 2, 28, opts), '2025-W09'],
      [DateTime.local(2020, 2, 29, opts), '2020-W09'],
      [DateTime.local(2024, 3, 30, opts), '2024-W13'],
    ]

    test.each(cases)(
      'given %p DateTime, expect %p formatted week date string',
      (givenDate, expectedResult) => {
        const chronoTypeInput: ChronoType = {
          interval: Interval.Daily,
          ordinal: Ordinal.Current,
        }
        const chronoNote = new ChronoNote(
          chronoTypeInput,
          fileProvider,
          givenDate as DateTime,
        )
        const result = chronoNote.formatWeekDate()
        expect(result).toEqual(expectedResult)
      },
    )
  })

  describe('getWeekNumber', () => {
    const cases = [
      [DateTime.local(2024, 1, 1, opts), 'Monday', 1],
      [DateTime.local(2024, 1, 7, opts), 'Sunday', 2],
      [DateTime.local(2024, 1, 27, opts), 'Saturday', 4],
      [DateTime.local(2024, 1, 29, opts), 'Monday', 5],
      [DateTime.local(2024, 2, 4, opts), 'Sunday', 6],
      [DateTime.local(2024, 2, 29, opts), 'Thursday', 9],
      [DateTime.local(2024, 3, 1, opts), 'Friday', 9],
      [DateTime.local(2024, 3, 30, opts), 'Saturday', 13],
      [DateTime.local(2024, 3, 31, opts), 'Sunday', 14],
      [DateTime.local(2024, 12, 22, opts), 'Sunday', 52],
      [DateTime.local(2024, 12, 28, opts), 'Saturday', 52],
    ]

    test.each(cases)(
      'given %p date, on %p, expect %p week number',
      (givenDate, _, expectedResult) => {
        const chronoTypeInput: ChronoType = {
          interval: Interval.Daily,
          ordinal: Ordinal.Current,
        }
        const chronoNote = new ChronoNote(
          chronoTypeInput,
          fileProvider,
          givenDate as DateTime,
        )

        const result = chronoNote.getWeekNumber()
        expect(result).toEqual(expectedResult as number)
      },
    )
  })
})
